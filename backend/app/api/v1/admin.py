from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User, UserRole
from app.schemas.auth import UserResponse

router = APIRouter()

def check_admin_role(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(check_admin_role),
    db: Session = Depends(get_db)
):
    """List all users with their status"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.post("/users/{user_id}/block")
async def block_user(
    user_id: int,
    current_user: User = Depends(check_admin_role),
    db: Session = Depends(get_db)
):
    """Block a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_blocked = True
    db.commit()
    return {"message": f"User {user.username} has been blocked"}

@router.post("/users/{user_id}/unblock")
async def unblock_user(
    user_id: int,
    current_user: User = Depends(check_admin_role),
    db: Session = Depends(get_db)
):
    """Unblock a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_blocked = False
    db.commit()
    return {"message": f"User {user.username} has been unblocked"}

from app.models.report import Report
from app.models.incident import Incident

@router.get("/reports")
async def get_reports(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(check_admin_role),
    db: Session = Depends(get_db)
):
    """List all user reports"""
    reports = db.query(Report).offset(skip).limit(limit).all()
    return reports

@router.post("/reports/{report_id}/resolve")
async def resolve_report(
    report_id: int,
    current_user: User = Depends(check_admin_role),
    db: Session = Depends(get_db)
):
    """Mark a report as resolved"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    report.status = "resolved"
    db.commit()
    return {"message": "Report resolved"}

@router.get("/incidents")
async def get_incidents(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(check_admin_role),
    db: Session = Depends(get_db)
):
    """List all automated incidents"""
    incidents = db.query(Incident).offset(skip).limit(limit).all()
    return incidents
