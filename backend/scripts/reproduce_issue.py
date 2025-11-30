import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.user import User

def reproduce():
    print("Connecting to local database...")
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        # 1. Insert a user with uppercase 'USER' role using raw SQL (bypassing ORM validation)
        print("Inserting user with uppercase 'USER' role...")
        try:
            db.execute(text("INSERT INTO users (username, email, hashed_password, role, safety_color, is_active, is_verified) VALUES ('test_enum_user', 'test_enum@example.com', 'hash', 'USER', 'GREEN', true, true)"))
            db.commit()
        except Exception as e:
            print(f"Insert failed (maybe already exists): {e}")
            # If exists, force update to uppercase
            db.execute(text("UPDATE users SET role='USER', safety_color='GREEN' WHERE email='test_enum@example.com'"))
            db.commit()

        # 2. Try to fetch using ORM
        print("Attempting to fetch user via ORM...")
        user = db.query(User).filter(User.email == 'test_enum@example.com').first()
        
        # 3. Access the enum field to trigger the lookup
        print(f"User role: {user.role}")
        print("SUCCESS: User fetched without error (Issue NOT reproduced!)")

    except Exception as e:
        print("\n!!! CAUGHT EXPECTED ERROR !!!")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {e}")
        print("Issue REPRODUCED successfully.")

    finally:
        # Cleanup
        try:
            db.execute(text("DELETE FROM users WHERE email='test_enum@example.com'"))
            db.commit()
        except:
            pass
        db.close()

if __name__ == "__main__":
    reproduce()
