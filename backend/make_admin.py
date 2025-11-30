"""
Script to make a user an admin in the database
"""
import psycopg2
import sys

# Database connection string
DATABASE_URL = "postgresql://neondb_owner:npg_dybMl3uk6vST@ep-lingering-cloud-ahvudh74-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

def make_admin(email):
    """Make a user an admin by email"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Update user role to admin
        cur.execute(
            "UPDATE users SET role = 'admin' WHERE email = %s RETURNING id, username, email, role",
            (email,)
        )
        
        result = cur.fetchone()
        
        if result:
            print(f"\n✅ Successfully made user an admin:")
            print(f"   ID: {result[0]}")
            print(f"   Username: {result[1]}")
            print(f"   Email: {result[2]}")
            print(f"   Role: {result[3]}")
            conn.commit()
        else:
            print(f"\n❌ User with email '{email}' not found")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_admin.py <email>")
        print("Example: python make_admin.py user@example.com")
        sys.exit(1)
    
    email = sys.argv[1]
    make_admin(email)
