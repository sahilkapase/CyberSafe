import asyncio
from sqlalchemy import text
from app.core.database import SessionLocal

def fix_admin_role():
    db = SessionLocal()
    try:
        # Update role to ADMIN (uppercase)
        print("Updating admin role to 'ADMIN'...")
        sql_update = text("UPDATE users SET role = 'ADMIN'::userrole WHERE username = 'admin'")
        result = db.execute(sql_update)
        db.commit()
        print(f"Updated {result.rowcount} row(s).")
        print("Admin user role fixed.")
        
    except Exception as e:
        print(f"Error fixing admin role: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_admin_role()
