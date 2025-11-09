#!/usr/bin/env python3
"""
Simple Authentication Test for PezkuwiChain
Tests the fixed authentication endpoints
"""

import requests
import json
import time
from datetime import datetime

BACKEND_URL = "https://kurdish-id.preview.emergentagent.com/api"

def test_auth_flow():
    """Test complete authentication flow"""
    print("🔐 Testing PezkuwiChain Authentication Flow")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Generate unique email
    timestamp = int(time.time())
    test_email = f"pezkuwi_test_{timestamp}@gmail.com"
    test_password = "SecurePass123!"
    
    print(f"Test Email: {test_email}")
    print()
    
    # Test 1: Signup
    print("1️⃣ Testing Signup...")
    signup_data = {
        "email": test_email,
        "password": test_password,
        "first_name": "Aram",
        "last_name": "Kurdistan",
        "phone": "+964750123456",
        "referral_code": "REF001",
        "language": "ku"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/signup", json=signup_data, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Signup SUCCESS")
            print(f"User ID: {data.get('user_id', 'N/A')}")
            print(f"Email: {data.get('email', 'N/A')}")
            print(f"First Name: {data.get('first_name', 'N/A')}")
            print(f"Last Name: {data.get('last_name', 'N/A')}")
            print(f"Has Access Token: {'Yes' if data.get('access_token') else 'No'}")
            print(f"Has Refresh Token: {'Yes' if data.get('refresh_token') else 'No'}")
            
            user_id = data.get('user_id')
            
        else:
            print(f"❌ Signup FAILED: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Signup ERROR: {str(e)}")
        return False
    
    print()
    
    # Test 2: Signin
    print("2️⃣ Testing Signin...")
    signin_data = {
        "email": test_email,
        "password": test_password
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/signin", json=signin_data, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Signin SUCCESS")
            print(f"User ID: {data.get('user_id', 'N/A')}")
            print(f"Email: {data.get('email', 'N/A')}")
            print(f"Has Access Token: {'Yes' if data.get('access_token') else 'No'}")
            
        else:
            print(f"❌ Signin FAILED: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Signin ERROR: {str(e)}")
        return False
    
    print()
    
    # Test 3: Get User Profile
    print("3️⃣ Testing Get User Profile...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/auth/user/{user_id}", timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Get Profile SUCCESS")
            print(f"Profile Data: {json.dumps(data, indent=2)}")
            
        else:
            print(f"❌ Get Profile FAILED: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Get Profile ERROR: {str(e)}")
        return False
    
    print()
    print("🎉 ALL AUTHENTICATION TESTS PASSED!")
    return True

if __name__ == "__main__":
    success = test_auth_flow()
    if not success:
        print("❌ Authentication tests failed")
        exit(1)
    else:
        print("✅ Authentication system working correctly")
        exit(0)