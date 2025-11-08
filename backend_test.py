#!/usr/bin/env python3
"""
Backend API Testing for PezkuwiChain Mobile App
Tests authentication endpoints with Supabase and blockchain endpoints
"""

import requests
import json
import uuid
import time
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://digital-kurdistan.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.user_data = None
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
    
    def test_signup(self):
        """Test user signup endpoint"""
        print("\n🔐 Testing User Signup...")
        
        # Generate unique test email
        unique_id = str(uuid.uuid4())[:8]
        test_email = f"test_{unique_id}@pezkuwi.com"
        
        signup_data = {
            "email": test_email,
            "password": "TestPassword123!",
            "first_name": "Test",
            "last_name": "User",
            "phone": "+964750123456",
            "referral_code": "REF123",
            "language": "ku"
        }
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/signup",
                json=signup_data,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                data = response.json()
                
                # Validate response structure
                required_fields = ["user_id", "email", "access_token", "refresh_token", "first_name", "last_name"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_result(
                        "Signup Response Structure", 
                        False, 
                        f"Missing fields: {missing_fields}",
                        data
                    )
                    return False
                
                # Store user data for subsequent tests
                self.user_data = {
                    "email": test_email,
                    "password": signup_data["password"],
                    "user_id": data["user_id"],
                    "access_token": data["access_token"],
                    "refresh_token": data["refresh_token"]
                }
                
                self.log_result(
                    "User Signup", 
                    True, 
                    f"User created successfully with ID: {data['user_id'][:8]}...",
                    {k: v for k, v in data.items() if k not in ["access_token", "refresh_token"]}
                )
                return True
                
            else:
                self.log_result(
                    "User Signup", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("User Signup", False, f"Request failed: {str(e)}")
            return False
    
    def test_signin(self):
        """Test user signin endpoint"""
        print("\n🔑 Testing User Signin...")
        
        if not self.user_data:
            self.log_result("User Signin", False, "No user data available (signup must succeed first)")
            return False
        
        signin_data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/auth/signin",
                json=signin_data,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["user_id", "email", "access_token", "refresh_token", "first_name", "last_name"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_result(
                        "Signin Response Structure", 
                        False, 
                        f"Missing fields: {missing_fields}",
                        data
                    )
                    return False
                
                # Verify user_id matches
                if data["user_id"] != self.user_data["user_id"]:
                    self.log_result(
                        "Signin User ID Match", 
                        False, 
                        f"User ID mismatch: expected {self.user_data['user_id']}, got {data['user_id']}"
                    )
                    return False
                
                # Update tokens
                self.user_data["access_token"] = data["access_token"]
                self.user_data["refresh_token"] = data["refresh_token"]
                
                self.log_result(
                    "User Signin", 
                    True, 
                    f"User signed in successfully: {data['email']}",
                    {k: v for k, v in data.items() if k not in ["access_token", "refresh_token"]}
                )
                return True
                
            else:
                self.log_result(
                    "User Signin", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("User Signin", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_user_profile(self):
        """Test get user profile endpoint"""
        print("\n👤 Testing Get User Profile...")
        
        if not self.user_data:
            self.log_result("Get User Profile", False, "No user data available (signup must succeed first)")
            return False
        
        try:
            response = self.session.get(
                f"{BACKEND_URL}/auth/user/{self.user_data['user_id']}",
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate profile data
                expected_fields = ["id", "email", "first_name", "last_name", "phone", "language"]
                missing_fields = [field for field in expected_fields if field not in data]
                
                if missing_fields:
                    self.log_result(
                        "Profile Response Structure", 
                        False, 
                        f"Missing fields: {missing_fields}",
                        data
                    )
                    return False
                
                # Verify data matches signup
                if data["email"] != self.user_data["email"]:
                    self.log_result(
                        "Profile Email Match", 
                        False, 
                        f"Email mismatch: expected {self.user_data['email']}, got {data['email']}"
                    )
                    return False
                
                self.log_result(
                    "Get User Profile", 
                    True, 
                    f"Profile retrieved successfully for user: {data['email']}",
                    {k: v for k, v in data.items() if k not in ["id"]}
                )
                return True
                
            else:
                self.log_result(
                    "Get User Profile", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get User Profile", False, f"Request failed: {str(e)}")
            return False
    
    def test_blockchain_balance(self):
        """Test blockchain balance endpoint"""
        print("\n⛓️ Testing Blockchain Balance...")
        
        # Test with a sample Polkadot address
        test_address = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
        
        balance_data = {
            "address": test_address
        }
        
        try:
            response = self.session.post(
                f"{BACKEND_URL}/blockchain/balance",
                json=balance_data,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ["address", "hez", "pez", "transferrable", "reserved", "timestamp"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_result(
                        "Balance Response Structure", 
                        False, 
                        f"Missing fields: {missing_fields}",
                        data
                    )
                    return False
                
                # Verify address matches
                if data["address"] != test_address:
                    self.log_result(
                        "Balance Address Match", 
                        False, 
                        f"Address mismatch: expected {test_address}, got {data['address']}"
                    )
                    return False
                
                self.log_result(
                    "Blockchain Balance", 
                    True, 
                    f"Balance retrieved: HEZ={data['hez']}, PEZ={data['pez']}",
                    data
                )
                return True
                
            else:
                self.log_result(
                    "Blockchain Balance", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}",
                    {"status_code": response.status_code, "response": response.text}
                )
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Blockchain Balance", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Test authentication flow
        signup_success = self.test_signup()
        signin_success = self.test_signin() if signup_success else False
        profile_success = self.test_get_user_profile() if signup_success else False
        
        # Test blockchain endpoint
        balance_success = self.test_blockchain_balance()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()