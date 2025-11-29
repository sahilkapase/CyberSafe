"""
Message endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import base64

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.message import Message
from app.models.incident import Incident, SeverityLevel, IncidentStatus
from app.models.friend_request import FriendRequest, FriendRequestStatus
from app.schemas.message import MessageCreate, MessageResponse
from app.services.ai_detection import ai_detection_service
from app.services.evidence_logger import evidence_logger

router = APIRouter()


@router.post("/send", response_model=MessageResponse)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message with AI detection"""
    # Check if users are friends
    if message_data.receiver_id != current_user.id:
        friendship = db.query(FriendRequest).filter(
            ((FriendRequest.sender_id == current_user.id) & (FriendRequest.receiver_id == message_data.receiver_id)) |
            ((FriendRequest.sender_id == message_data.receiver_id) & (FriendRequest.receiver_id == current_user.id)),
            FriendRequest.status == FriendRequestStatus.ACCEPTED
        ).first()
        
        if not friendship:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Users must be friends to send messages"
            )
    
    # Check if current user is blocked
    if current_user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is blocked"
        )
    
    # AI Detection for text messages
    content_filtered = message_data.content
    is_flagged = False
    severity_score = None
    is_blocked = False
    
    if message_data.message_type == "text":
        detection_result = await ai_detection_service.detect_text_abuse(
            message_data.content,
            current_user.sensitivity_level.value
        )
        
        if detection_result["is_abusive"]:
            is_flagged = True
            severity_score = detection_result["severity"]
            content_filtered = detection_result["filtered_text"]
            
            # Create incident
            incident = Incident(
                user_id=current_user.id,
                severity=SeverityLevel(detection_result["severity"]),
                detected_content=message_data.content,
                content_filtered=content_filtered,
                ai_analysis=detection_result["analysis"],
                detection_model="groq-llama",
                confidence_score=str(detection_result["confidence"])
            )
            
            db.add(incident)
            
            # Update user warning count
            current_user.warning_count += 1
            
            # Check thresholds
            if current_user.warning_count >= 3:
                current_user.has_red_tag = True
            if current_user.warning_count >= 5:
                current_user.is_blocked = True
                is_blocked = True
            
            # Log evidence
            evidence_logger.log_incident(
                user_id=current_user.id,
                message_id=None,
                severity=detection_result["severity"],
                detected_content=message_data.content,
                ai_analysis=detection_result["analysis"],
                context=f"Message to user {message_data.receiver_id}"
            )
            
            db.commit()
    
    # Create message
    message = Message(
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        content=message_data.content,
        content_filtered=content_filtered,
        message_type=message_data.message_type,
        file_url=message_data.file_url,
        is_flagged=is_flagged,
        severity_score=severity_score,
        is_blocked=is_blocked
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return message


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and validate image"""
    # Read image data
    image_data = await file.read()
    
    # Detect inappropriate content
    detection_result = await ai_detection_service.detect_image_content(image_data)
    
    if not detection_result["is_safe"]:
        # Log incident
        incident = Incident(
            user_id=current_user.id,
            severity=SeverityLevel.HIGH,
            detected_content=f"Inappropriate image: {file.filename}",
            ai_analysis=f"NSFW score: {detection_result['nsfw_score']}, Categories: {detection_result['categories']}",
            detection_model="huggingface-nsfw",
            confidence_score=str(detection_result["confidence"])
        )
        
        db.add(incident)
        current_user.warning_count += 1
        
        if current_user.warning_count >= 3:
            current_user.has_red_tag = True
        if current_user.warning_count >= 5:
            current_user.is_blocked = True
        
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image contains inappropriate content and cannot be sent"
        )
    
    # Save image (in production, use cloud storage)
    import os
    from pathlib import Path
    upload_dir = Path("./uploads")
    upload_dir.mkdir(exist_ok=True)
    
    file_path = upload_dir / f"{current_user.id}_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(image_data)
    
    return {
        "file_url": f"/uploads/{file_path.name}",
        "is_safe": True
    }


@router.get("/conversation/{user_id}", response_model=List[MessageResponse])
async def get_conversation(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get conversation between current user and another user"""
    messages = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.created_at.asc()).all()
    
    return messages


@router.get("/conversations", response_model=List[dict])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for current user"""
    # Get all unique user IDs that current user has messaged with
    # We can optimize this by using a union query
    sent_subquery = db.query(Message.receiver_id.label("user_id")).filter(Message.sender_id == current_user.id)
    received_subquery = db.query(Message.sender_id.label("user_id")).filter(Message.receiver_id == current_user.id)
    
    user_ids_query = sent_subquery.union(received_subquery)
    user_ids = [row[0] for row in user_ids_query.all()]
    
    if not user_ids:
        return []

    # Fetch all last messages in a more efficient way
    # This is still not fully optimized but better than N+1 for users
    # Ideally we would use a window function in SQL, but keeping it simple for SQLite support
    
    conversations = []
    
    # Fetch all users involved in conversations in one go
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    user_map = {u.id: u for u in users}
    
    # Add CyberBOT if present
    if 0 in user_ids:
        user_map[0] = User(id=0, username="CyberBOT", has_red_tag=False)

    for uid in user_ids:
        # Get last message for this specific conversation
        last_message = db.query(Message).filter(
            ((Message.sender_id == current_user.id) & (Message.receiver_id == uid)) |
            ((Message.sender_id == uid) & (Message.receiver_id == current_user.id))
        ).order_by(Message.created_at.desc()).first()
        
        if not last_message:
            continue
            
        other_user = user_map.get(uid)
        if not other_user and uid != 0:
            continue
            
        # Format user data
        user_data = {
            "id": 0,
            "username": "CyberBOT",
            "avatar_url": None,
            "has_red_tag": False
        }
        
        if uid != 0 and other_user:
            user_data = {
                "id": other_user.id,
                "username": other_user.username,
                "avatar_url": other_user.avatar_url,
                "has_red_tag": other_user.has_red_tag
            }
            
        conversations.append({
            "user": user_data,
            "last_message": {
                "id": last_message.id,
                "content": last_message.content_filtered or last_message.content,
                "created_at": last_message.created_at,
                "sender_id": last_message.sender_id
            }
        })
    
    # Sort by last message time
    conversations.sort(key=lambda x: x["last_message"]["created_at"], reverse=True)
    
    return conversations

