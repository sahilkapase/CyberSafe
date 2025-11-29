import asyncio
from app.core.database import SessionLocal
from app.models.user import User, UserRole, SensitivityLevel
from app.core.security import get_password_hash
import bcrypt

def reset_admin():
    db = SessionLocal()
    try:
        # Check if admin exists
        user = db.query(User).filter(User.username == "admin").first()
        
        hashed_pw = bcrypt.hashpw("admin@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        if user:
            print(f"Updating existing admin user: {user.username}")
            user.hashed_password = hashed_pw
            user.role = UserRole.ADMIN
            user.is_active = True
            user.is_blocked = False
        else:
            print("Creating new admin user")
            user = User(
                username="admin",
                email="admin@example.com",
                hashed_password=hashed_pw,
                full_name="System Admin",
                role=UserRole.ADMIN,
                is_active=True,
                is_verified=True,
                sensitivity_level=SensitivityLevel.MEDIUM,
                has_red_tag=False,
                warning_count=0,
                is_blocked=False
            )
            db.add(user)
            
        db.commit()
        print("Admin user ready.")
        print("Username: admin")
        print("Password: admin@123")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin()
