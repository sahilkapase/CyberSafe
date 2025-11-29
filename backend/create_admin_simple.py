import asyncio
from sqlalchemy import text
from app.core.database import SessionLocal
import bcrypt

def create_admin_simple():
    db = SessionLocal()
    try:
        # Hash password
        hashed_pw = bcrypt.hashpw("admin@123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # 1. Insert with minimal fields, let defaults handle Enums
        print("Inserting user...")
        sql_insert = text("""
            INSERT INTO users (username, email, hashed_password, full_name, is_active, is_verified, created_at, updated_at)
            VALUES (:username, :email, :hashed_password, :full_name, true, true, NOW(), NOW())
            RETURNING id
        """)
        
        result = db.execute(sql_insert, {
            "username": "admin",
            "email": "admin@example.com",
            "hashed_password": hashed_pw,
            "full_name": "System Admin"
        })
        user_id = result.fetchone()[0]
        print(f"User inserted with ID: {user_id}")
        
        # 2. Update role to admin
        print("Updating role to admin...")
        # Try casting to userrole, if that fails, we might need another approach
        sql_update = text("UPDATE users SET role = 'admin'::userrole WHERE id = :id")
        db.execute(sql_update, {"id": user_id})
        
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
    create_admin_simple()
