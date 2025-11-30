"""
API v1 router
"""
from fastapi import APIRouter
from app.api.v1 import auth, friends, messages, admin, websocket, support, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(friends.router, prefix="/friends", tags=["friends"])
api_router.include_router(messages.router, prefix="/messages", tags=["messages"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"])
api_router.include_router(support.router, prefix="/support", tags=["support"])
api_router.include_router(users.router, prefix="/users", tags=["users"])

