import asyncio
import websockets
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"
WS_URL = "ws://127.0.0.1:8000/api/v1/chat"

# Helper to get token
def get_token(email, password):
    response = requests.post(f"{BASE_URL}/auth/login", data={"username": email, "password": password})
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

# Helper to create user
def create_user(username, email, password):
    requests.post(f"{BASE_URL}/auth/signup", json={
        "username": username,
        "email": email,
        "password": password,
        "full_name": username
    })

async def verify_warning():
    # 1. Setup Users
    print("Setting up users...")
    create_user("violator", "violator@example.com", "password123")
    create_user("victim", "victim@example.com", "password123")
    
    token_violator = get_token("violator@example.com", "password123")
    token_victim = get_token("victim@example.com", "password123")
    
    if not token_violator or not token_victim:
        print("Failed to get tokens")
        return

    # Get IDs
    user_violator = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token_violator}"}).json()
    user_victim = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token_victim}"}).json()
    
    id_violator = user_violator["id"]
    id_victim = user_victim["id"]
    
    print(f"Violator ID: {id_violator}, Victim ID: {id_victim}")

    # 2. Connect WebSockets
    print("Connecting WebSockets...")
    async with websockets.connect(f"{WS_URL}/{token_violator}") as ws_violator, \
               websockets.connect(f"{WS_URL}/{token_victim}") as ws_victim:
        
        # 3. Violator sends abusive message
        print("Violator sending abusive message...")
        await ws_violator.send(json.dumps({
            "type": "message",
            "receiver_id": id_victim,
            "content": "I hate you, you are stupid and ugly.",
            "message_type": "text"
        }))
        
        # 4. Listen for responses
        print("Listening for responses...")
        
        violator_got_warning = False
        victim_got_flagged = False
        
        # Check Violator (should get cyberbot_warning)
        try:
            while True:
                msg = await asyncio.wait_for(ws_violator.recv(), timeout=5.0)
                data = json.loads(msg)
                print(f"Violator received: {data.get('type')}")
                if data.get("type") == "cyberbot_warning":
                    print("SUCCESS: Violator received warning.")
                    violator_got_warning = True
                    break
                if data.get("type") == "message_sent":
                    print("Violator received confirmation.")
        except asyncio.TimeoutError:
            print("Timeout waiting for violator warning.")

        # Check Victim (should get flagged message)
        try:
            while True:
                msg = await asyncio.wait_for(ws_victim.recv(), timeout=5.0)
                data = json.loads(msg)
                print(f"Victim received: {data.get('type')}")
                if data.get("type") == "message":
                    if data.get("is_flagged"):
                        print("SUCCESS: Victim received flagged message.")
                        victim_got_flagged = True
                    else:
                        print("FAILURE: Victim received message but NOT flagged.")
                    break
        except asyncio.TimeoutError:
            print("Timeout waiting for victim message.")

        if violator_got_warning and victim_got_flagged:
            print("\nVERIFICATION SUCCESSFUL: Backend logic is working.")
        else:
            print("\nVERIFICATION FAILED: Backend logic issue.")

if __name__ == "__main__":
    asyncio.run(verify_warning())
