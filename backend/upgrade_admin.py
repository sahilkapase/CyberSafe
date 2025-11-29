from app.core.database import SessionLocal
from sqlalchemy import text

def upgrade_admin():
    db = SessionLocal()
    try:
        # Check if user exists
        result = db.execute(text("SELECT id FROM users WHERE username = 'admin'"))
        user = result.fetchone()
        
        if not user:
            print("User 'admin' not found. Please sign up with username 'admin' first.")
            return

        # Update role to admin
        # Note: We use raw SQL to avoid Enum issues if any
        db.execute(text("UPDATE users SET role = 'admin' WHERE username = 'admin'"))
        db.commit()
        print("Successfully upgraded user 'admin' to ADMIN role.")
        
    except Exception as e:
        print(f"Error upgrading user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    upgrade_admin()
