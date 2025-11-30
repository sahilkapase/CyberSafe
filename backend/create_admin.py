import asyncio
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole, SensitivityLevel

async def create_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("Admin user already exists.")
            return

        # Create admin user
        hashed_pw = get_password_hash("admin@123")
        
        admin_user = User(
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
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully.")
        print("Username: admin")
        print("Password: admin@123")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
