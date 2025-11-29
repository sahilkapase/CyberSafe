from app.core.database import SessionLocal
# from app.models.user import User
from sqlalchemy import text

def check_admin():
    db = SessionLocal()
    try:
        # Try raw SQL to avoid ORM mapper issues
        result = db.execute(text("SELECT username, email, role FROM users WHERE username = 'admin'"))
        user = result.fetchone()
        if user:
            print(f"User found: {user}")
        else:
            print("User 'admin' not found.")
    except Exception as e:
        print(f"Error checking user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_admin()
