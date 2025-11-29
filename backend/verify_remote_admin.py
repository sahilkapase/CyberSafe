from sqlalchemy import text
from app.core.database import SessionLocal

def verify_remote_admin():
    db = SessionLocal()
    try:
        # Check connection string (masked)
        # print(f"Connecting to: {db.get_bind().url}") 
        
        result = db.execute(text("SELECT id, username, email, role, is_active, is_blocked, warning_count FROM users WHERE username = 'admin'"))
        user = result.fetchone()
        
        if user:
            print("Admin user found in database:")
            print(f"ID: {user[0]}")
            print(f"Username: {user[1]}")
            print(f"Email: {user[2]}")
            print(f"Role: {user[3]}")
            print(f"Is Active: {user[4]}")
            print(f"Is Blocked: {user[5]}")
            print(f"Warning Count: {user[6]}")
        else:
            print("Admin user NOT found in database.")
            
    except Exception as e:
        print(f"Error verifying admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_remote_admin()
