import sys
import os

# Add current directory to path
sys.path.insert(0, os.getcwd())

from app.core.security import get_password_hash, verify_password

def test_hashing():
    password = "Test123!"
    print(f"Testing password: {password}")
    
    # Hash
    hashed = get_password_hash(password)
    print(f"Hashed: {hashed}")
    
    # Verify
    is_valid = verify_password(password, hashed)
    print(f"Verification result: {is_valid}")
    
    if is_valid:
        print("✅ Password hashing works correctly")
    else:
        print("❌ Password hashing FAILED")

if __name__ == "__main__":
    test_hashing()
