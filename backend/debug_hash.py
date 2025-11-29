from app.core.security import get_password_hash
try:
    print(f"Hashing 'admin@123'...")
    hash = get_password_hash("admin@123")
    print(f"Hash: {hash}")
except Exception as e:
    print(f"Error: {e}")
