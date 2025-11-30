import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text

# Hardcoded production URL to ensure we target the right DB
PROD_DATABASE_URL = "postgresql://neondb_owner:npg_dybMl3uk6vST@ep-lingering-cloud-ahvudh74-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

def fix_enums():
    print(f"Connecting to production database...")
    engine = create_engine(PROD_DATABASE_URL)
    with engine.connect() as conn:
        try:
            print("Normalizing 'role' column to lowercase...")
            conn.execute(text("UPDATE users SET role = LOWER(role)"))
            
            print("Normalizing 'safety_color' column to lowercase...")
            conn.execute(text("UPDATE users SET safety_color = LOWER(safety_color)"))
            
            conn.commit()
            print("Successfully updated enum values to lowercase!")
        except Exception as e:
            print(f"Error updating database: {e}")

if __name__ == "__main__":
    fix_enums()
