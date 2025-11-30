import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.user import User, UserRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin(username, email, password):
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists. Updating role to ADMIN.")
            user.role = UserRole.ADMIN
            db.commit()
        else:
            print(f"Creating new admin user {username}...")
            hashed_password = pwd_context.hash(password)
            new_user = User(
                username=username,
                email=email,
                hashed_password=hashed_password,
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True
            )
            db.add(new_user)
            db.commit()
            print("Admin user created successfully.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python create_admin.py <username> <email> <password>")
        print("Example: python create_admin.py admin admin@cybersafe.com admin123")
    else:
        create_admin(sys.argv[1], sys.argv[2], sys.argv[3])
