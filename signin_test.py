#!/usr/bin/env python3
"""
Test signin and profile retrieval with existing user
"""

import requests
import json

BACKEND_URL = "https://digital-kurdistan.preview.emergentagent.com/api"

def test_existing_user_signin():
    """Test signin with existing user from logs"""
    print("🔐 Testing Signin with Existing User")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    # Use the email from successful signup in logs
    test_email = "test1b42307a@gmail.com"
    test_password = "TestPassword123!"  # From backend_test.py
    
    print(f"Testing with email: {test_email}")
    print()
    
    # Test Signin
    print("1️⃣ Testing Signin...")
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
            print(f"First Name: {data.get('first_name', 'N/A')}")
            print(f"Last Name: {data.get('last_name', 'N/A')}")
            print(f"Has Access Token: {'Yes' if data.get('access_token') else 'No'}")
            print(f"Has Refresh Token: {'Yes' if data.get('refresh_token') else 'No'}")
            
            user_id = data.get('user_id')
            
            # Test Get User Profile
            print()
            print("2️⃣ Testing Get User Profile...")
            
            try:
                profile_response = requests.get(f"{BACKEND_URL}/auth/user/{user_id}", timeout=30)
                print(f"Status: {profile_response.status_code}")
                
                if profile_response.status_code == 200:
                    profile_data = profile_response.json()
                    print("✅ Get Profile SUCCESS")
                    print("Profile Data:")
                    print(json.dumps(profile_data, indent=2))
                    
                    # Validate expected fields
                    expected_fields = ["id", "email", "first_name", "last_name", "phone", "tiki_count", "trust_score"]
                    missing_fields = [field for field in expected_fields if field not in profile_data]
                    
                    if missing_fields:
                        print(f"⚠️ Missing profile fields: {missing_fields}")
                    else:
                        print("✅ All expected profile fields present")
                    
                    return True
                    
                else:
                    print(f"❌ Get Profile FAILED: {profile_response.status_code}")
                    print(f"Error: {profile_response.text}")
                    return False
                    
            except Exception as e:
                print(f"❌ Get Profile ERROR: {str(e)}")
                return False
            
        else:
            print(f"❌ Signin FAILED: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Signin ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_existing_user_signin()
    if success:
        print("\n🎉 Signin and Profile tests PASSED!")
    else:
        print("\n❌ Tests FAILED")
        exit(1)