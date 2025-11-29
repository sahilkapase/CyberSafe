import asyncio
from sqlalchemy import text
from app.core.database import SessionLocal
from app.core.security import get_password_hash

async def create_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        result = db.execute(text("SELECT id FROM users WHERE username = 'admin'"))
        if result.fetchone():
            print("Admin user already exists.")
            return

        # Create admin user using raw SQL
        import bcrypt
        hashed_pw = bcrypt.hashpw("admin@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Note: Adjust columns based on your schema. I'm using the columns I saw in User model.
        # id is likely auto-incrementing (SERIAL)
        sql = text("""
            INSERT INTO users (username, email, hashed_password, role, full_name, is_active, is_verified, sensitivity_level, has_red_tag, warning_count, is_blocked, created_at, updated_at)
            VALUES (:username, :email, :hashed_password, 'admin', :full_name, :is_active, :is_verified, 'medium', :has_red_tag, :warning_count, :is_blocked, NOW(), NOW())
        """)
        
        db.execute(sql, {
            "username": "admin",
            "email": "admin@example.com",
            "hashed_password": hashed_pw,
            "full_name": "System Admin",
            "is_active": True,
            "is_verified": True,
            "has_red_tag": False,
            "warning_count": 0,
            "is_blocked": False
        })
        db.commit()
        print("Admin user created successfully.")
        print("Username: admin")
        print("Password: admin@123")
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
