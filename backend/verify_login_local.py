import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

def verify_login():
    # Test 1: Login with Email (Standard Flow)
    print("\n--- Test 1: Login with Email (admin@example.com) ---")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={"username": "admin@example.com", "password": "admin@123"}
        )
        if response.status_code == 200:
            print("SUCCESS: Logged in with email.")
            print(f"Token: {response.json().get('access_token')[:20]}...")
        else:
            print(f"FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error: {e}")

    # Test 2: Login with Username (Potential User Confusion)
    print("\n--- Test 2: Login with Username (admin) ---")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data={"username": "admin", "password": "admin@123"}
        )
        if response.status_code == 200:
            print("SUCCESS: Logged in with username.")
        else:
            print(f"FAILED: {response.status_code} - {response.text}")
            print("NOTE: This is expected if the backend only checks email.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_login()
