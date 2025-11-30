import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text

# Hardcoded production URL to ensure we target the right DB
PROD_DATABASE_URL = "postgresql://neondb_owner:npg_dybMl3uk6vST@ep-lingering-cloud-ahvudh74-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

def upgrade_db():
    print(f"Connecting to production database...")
    engine = create_engine(PROD_DATABASE_URL)
    with engine.connect() as conn:
        try:
            # Check if column exists first to avoid error
            print("Attempting to add safety_color column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN safety_color VARCHAR DEFAULT 'green'"))
            conn.commit()
            print("Successfully added safety_color column!")
        except Exception as e:
            print(f"Note: {e}")
            print("Column might already exist or other error occurred.")

if __name__ == "__main__":
    upgrade_db()
