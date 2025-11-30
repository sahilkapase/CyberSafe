import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text

# Hardcoded production URL
PROD_DATABASE_URL = "postgresql://neondb_owner:npg_dybMl3uk6vST@ep-lingering-cloud-ahvudh74-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

def update_messages_table():
    print(f"Connecting to production database...")
    engine = create_engine(PROD_DATABASE_URL)
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            print("Adding 'is_nsfw' column...")
            try:
                conn.execute(text("ALTER TABLE messages ADD COLUMN is_nsfw BOOLEAN DEFAULT FALSE"))
            except Exception as e:
                print(f"Note: Could not add is_nsfw (might already exist): {e}")

            print("Adding 'nsfw_confidence' column...")
            try:
                conn.execute(text("ALTER TABLE messages ADD COLUMN nsfw_confidence VARCHAR"))
            except Exception as e:
                print(f"Note: Could not add nsfw_confidence (might already exist): {e}")

            trans.commit()
            print("Successfully updated messages table!")
            
        except Exception as e:
            trans.rollback()
            print(f"Error updating database: {e}")
            print("Rolling back changes...")

if __name__ == "__main__":
    update_messages_table()
