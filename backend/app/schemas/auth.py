"""
Authentication schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class SocialLoginRequest(BaseModel):
    email: EmailStr
    username: str
    provider: str
    avatar_url: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    sensitivity_level: str
    role: str
    has_red_tag: bool
    warning_count: int
    
    class Config:
        from_attributes = True

