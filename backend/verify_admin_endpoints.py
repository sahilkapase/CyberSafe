import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

def verify_admin_endpoints():
    # Login as admin
    print("Logging in as admin...")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": "admin@example.com", "password": "admin@123"}
    )
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Verify Reports Endpoint
    print("\nVerifying GET /admin/reports...")
    resp = requests.get(f"{BASE_URL}/admin/reports", headers=headers)
    if resp.status_code == 200:
        print(f"SUCCESS: Reports endpoint working. Count: {len(resp.json())}")
    else:
        print(f"FAILED: {resp.status_code} - {resp.text}")

    # Verify Incidents Endpoint
    print("\nVerifying GET /admin/incidents...")
    resp = requests.get(f"{BASE_URL}/admin/incidents", headers=headers)
    if resp.status_code == 200:
        print(f"SUCCESS: Incidents endpoint working. Count: {len(resp.json())}")
    else:
        print(f"FAILED: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    verify_admin_endpoints()
