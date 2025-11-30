import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text

# Hardcoded production URL
PROD_DATABASE_URL = "postgresql://neondb_owner:npg_dybMl3uk6vST@ep-lingering-cloud-ahvudh74-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

def fix_enums_robust():
    print(f"Connecting to production database...")
    engine = create_engine(PROD_DATABASE_URL)
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("Migrating 'userrole' type...")
            # 0. Drop default
            conn.execute(text("ALTER TABLE users ALTER COLUMN role DROP DEFAULT"))

            # 1. Rename old type
            try:
                with conn.begin_nested():
                    conn.execute(text("ALTER TYPE userrole RENAME TO userrole_old"))
            except Exception as e:
                print(f"Note: Could not rename userrole: {e}")

            # 2. Create new type
            try:
                with conn.begin_nested():
                    conn.execute(text("CREATE TYPE userrole AS ENUM('user', 'admin')"))
            except Exception as e:
                print(f"Note: Could not create userrole: {e}")

            # 3. Convert column
            conn.execute(text("ALTER TABLE users ALTER COLUMN role TYPE userrole USING lower(role::text)::userrole"))
            
            # 4. Drop old type
            try:
                with conn.begin_nested():
                    conn.execute(text("DROP TYPE userrole_old"))
            except Exception:
                pass
            
            # 5. Restore default
            conn.execute(text("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user'::userrole"))
            print("Successfully migrated 'userrole'.")

            print("Migrating 'safetycolor' type...")
            # 0. Drop default
            conn.execute(text("ALTER TABLE users ALTER COLUMN safety_color DROP DEFAULT"))

            # 1. Rename old type (Use RENAME instead of DROP because column depends on it)
            try:
                with conn.begin_nested():
                    conn.execute(text("ALTER TYPE safetycolor RENAME TO safetycolor_old"))
            except Exception as e:
                print(f"Note: Could not rename safetycolor: {e}")

            # 2. Create new type
            try:
                with conn.begin_nested():
                    conn.execute(text("CREATE TYPE safetycolor AS ENUM('green', 'yellow', 'red')"))
            except Exception as e:
                print(f"Note: Could not create safetycolor: {e}")

            # 3. Convert column
            conn.execute(text("ALTER TABLE users ALTER COLUMN safety_color TYPE safetycolor USING lower(safety_color::text)::safetycolor"))
            
            # 4. Drop old type
            try:
                with conn.begin_nested():
                    conn.execute(text("DROP TYPE safetycolor_old"))
            except Exception:
                pass
            
            # 5. Restore default
            conn.execute(text("ALTER TABLE users ALTER COLUMN safety_color SET DEFAULT 'green'::safetycolor"))
            print("Successfully migrated 'safetycolor'.")

            trans.commit()
            print("All Enum migrations completed successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"Error updating database: {e}")
            print("Rolling back changes...")

if __name__ == "__main__":
    fix_enums_robust()
