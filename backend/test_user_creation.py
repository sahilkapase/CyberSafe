"""
Test script to create a user and test login
"""
import sys
sys.path.insert(0, '.')

from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, verify_password

def create_test_user():
    db = SessionLocal()
    
    # Check if user exists
    existing = db.query(User).filter(User.email == "test@example.com").first()
    if existing:
        print(f"User already exists: {existing.email}")
        print(f"Testing password verification...")
        result = verify_password("Test123!", existing.hashed_password)
        print(f"Password verification result: {result}")
        db.close()
        return
    
    # Create new user
    hashed_pw = get_password_hash("Test123!")
    user = User(
        username="testuser",
        email="test@example.com",
        full_name="Test User",
        hashed_password=hashed_pw,
        is_active=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    print(f"✅ Created user: {user.email}")
    print(f"   ID: {user.id}")
    print(f"   Username: {user.username}")
    print(f"   Active: {user.is_active}")
    
    # Test password
    test_result = verify_password("Test123!", user.hashed_password)
    print(f"   Password test: {test_result}")
    
    db.close()

if __name__ == "__main__":
    create_test_user()
