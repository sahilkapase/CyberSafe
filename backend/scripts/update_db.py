import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.core.config import settings

def upgrade_db():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN safety_color VARCHAR DEFAULT 'green'"))
            print("Added safety_color column")
        except Exception as e:
            print(f"Column might already exist or error: {e}")

if __name__ == "__main__":
    upgrade_db()
