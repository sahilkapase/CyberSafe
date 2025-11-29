"""
User management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.block import Block
from app.schemas.friend import UserResponse

router = APIRouter()

@router.post("/block/{user_id}")
async def block_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Block a user"""
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot block yourself"
        )
    
    # Check if user exists
    user_to_block = db.query(User).filter(User.id == user_id).first()
    if not user_to_block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if already blocked
    existing_block = db.query(Block).filter(
        Block.blocker_id == current_user.id,
        Block.blocked_id == user_id
    ).first()
    
    if existing_block:
        return {"message": "User already blocked"}
    
    # Create block
    block = Block(blocker_id=current_user.id, blocked_id=user_id)
    db.add(block)
    db.commit()
    
    return {"message": "User blocked successfully"}

@router.get("/blocked", response_model=List[UserResponse])
async def get_blocked_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of blocked users"""
    blocks = db.query(Block).filter(Block.blocker_id == current_user.id).all()
    blocked_ids = [b.blocked_id for b in blocks]
    
    blocked_users = db.query(User).filter(User.id.in_(blocked_ids)).all()
    return blocked_users

@router.delete("/block/{user_id}")
async def unblock_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unblock a user"""
    block = db.query(Block).filter(
        Block.blocker_id == current_user.id,
        Block.blocked_id == user_id
    ).first()
    
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    
    db.delete(block)
    db.commit()
    
    return {"message": "User unblocked successfully"}
