import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.core.config import settings

def fix_enums_local():
    print(f"Connecting to local database...")
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("Migrating 'userrole' type...")
            # 0. Drop default to avoid cast errors
            conn.execute(text("ALTER TABLE users ALTER COLUMN role DROP DEFAULT"))

            # 1. Rename old type
            try:
                conn.execute(text("ALTER TYPE userrole RENAME TO userrole_old"))
            except Exception:
                print("Note: Could not rename userrole (might not exist or already renamed)")

            # 2. Create new type with lowercase values
            try:
                conn.execute(text("CREATE TYPE userrole AS ENUM('user', 'admin')"))
            except Exception:
                print("Note: userrole type might already exist")

            # 3. Convert column to use new type, lowercasing the values
            conn.execute(text("ALTER TABLE users ALTER COLUMN role TYPE userrole USING lower(role::text)::userrole"))
            
            # 4. Drop old type
            try:
                conn.execute(text("DROP TYPE userrole_old"))
            except Exception:
                pass
            
            # 5. Restore default
            conn.execute(text("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'::userrole"))
            
            print("Successfully migrated 'userrole'.")

            print("Migrating 'safetycolor' type...")
            # 0. Drop default
            conn.execute(text("ALTER TABLE users ALTER COLUMN safety_color DROP DEFAULT"))

            # 1. Drop old type if exists (since column is varchar locally)
            try:
                conn.execute(text("DROP TYPE IF EXISTS safetycolor"))
            except Exception as e:
                print(f"Note: Could not drop safetycolor: {e}")

            # 2. Create new type with lowercase values
            conn.execute(text("CREATE TYPE safetycolor AS ENUM('green', 'yellow', 'red')"))

            # 3. Convert column to use new type, lowercasing the values
            conn.execute(text("ALTER TABLE users ALTER COLUMN safety_color TYPE safetycolor USING lower(safety_color::text)::safetycolor"))
            
            # 4. Restore default
            conn.execute(text("ALTER TABLE users ALTER COLUMN safety_color SET DEFAULT 'green'::safetycolor"))
                
            print("Successfully migrated 'safetycolor'.")

            trans.commit()
            print("All Enum migrations completed successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"Error updating database: {e}")
            if hasattr(e, 'orig'):
                print(f"Original error: {e.orig}")
            print("Rolling back changes...")

if __name__ == "__main__":
    fix_enums_local()
