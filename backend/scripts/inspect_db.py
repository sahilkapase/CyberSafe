import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.core.config import settings

def inspect():
    print("Connecting to local database...")
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        print("\n--- Column Types ---")
        # Query to get column data types in Postgres
        result = conn.execute(text("""
            SELECT column_name, data_type, udt_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name IN ('role', 'safety_color')
        """))
        for row in result:
            print(f"Column: {row[0]}, Type: {row[1]}, UDT: {row[2]}")

        print("\n--- Distinct Values in 'role' ---")
        try:
            result = conn.execute(text("SELECT DISTINCT role FROM users"))
            for row in result:
                print(f"'{row[0]}'")
        except Exception as e:
            print(f"Error querying role: {e}")

        print("\n--- Distinct Values in 'safety_color' ---")
        try:
            result = conn.execute(text("SELECT DISTINCT safety_color FROM users"))
            for row in result:
                print(f"'{row[0]}'")
        except Exception as e:
            print(f"Error querying safety_color: {e}")

if __name__ == "__main__":
    inspect()
