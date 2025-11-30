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
            # 1. Rename old type
            conn.execute(text("ALTER TYPE userrole RENAME TO userrole_old"))
            # 2. Create new type with lowercase values
            conn.execute(text("CREATE TYPE userrole AS ENUM('user', 'admin')"))
            # 3. Convert column to use new type, lowercasing the values
            conn.execute(text("ALTER TABLE users ALTER COLUMN role TYPE userrole USING lower(role::text)::userrole"))
            # 4. Drop old type
            conn.execute(text("DROP TYPE userrole_old"))
            print("Successfully migrated 'userrole'.")

            print("Migrating 'safetycolor' type...")
            # 1. Rename old type
            conn.execute(text("ALTER TYPE safetycolor RENAME TO safetycolor_old"))
            # 2. Create new type with lowercase values
            conn.execute(text("CREATE TYPE safetycolor AS ENUM('green', 'yellow', 'red')"))
            # 3. Convert column to use new type, lowercasing the values
            conn.execute(text("ALTER TABLE users ALTER COLUMN safety_color TYPE safetycolor USING lower(safety_color::text)::safetycolor"))
            # 4. Drop old type
            conn.execute(text("DROP TYPE safetycolor_old"))
            print("Successfully migrated 'safetycolor'.")

            trans.commit()
            print("All Enum migrations completed successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"Error updating database: {e}")
            print("Rolling back changes...")

if __name__ == "__main__":
    fix_enums_robust()
