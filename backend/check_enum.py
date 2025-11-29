from sqlalchemy import text
from app.core.database import SessionLocal

def check_enum():
    db = SessionLocal()
    try:
        result = db.execute(text("""
            SELECT e.enumlabel
            FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'userrole'
        """))
        rows = result.fetchall()
        print(f"Valid UserRole values: {[r[0] for r in rows]}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_enum()
