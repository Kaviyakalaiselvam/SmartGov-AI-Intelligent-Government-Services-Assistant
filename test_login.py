#!/usr/bin/env python3
import requests
import json

# Test login endpoint
url = 'http://localhost:8000/api/users/auth/login/'
data = {
    'username': 'admin',
    'password': 'admin123456'
}

print(f"Testing login endpoint: {url}")
print(f"Credentials: {data}")
print("\n" + "="*60)

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ LOGIN SUCCESSFUL!")
        print(f"Token: {result.get('token', 'N/A')[:20]}...")
        print(f"User: {result.get('user', {}).get('username', 'N/A')}")
    else:
        print(f"\n❌ LOGIN FAILED!")
        
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
