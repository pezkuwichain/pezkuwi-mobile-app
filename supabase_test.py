#!/usr/bin/env python3
"""
Simple Supabase connection and schema test
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

print(f"Supabase URL: {SUPABASE_URL}")
print(f"Supabase Key: {SUPABASE_KEY[:20]}...")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase client created successfully")
    
    # Try to check if users table exists
    try:
        result = supabase.table("users").select("*").limit(1).execute()
        print(f"✅ Users table exists, data: {result.data}")
    except Exception as e:
        print(f"❌ Users table error: {e}")
        
        # Try to create the users table
        try:
            # This won't work with the anon key, but let's see the error
            print("Attempting to check table schema...")
            result = supabase.rpc('get_table_schema', {'table_name': 'users'}).execute()
            print(f"Schema result: {result}")
        except Exception as schema_e:
            print(f"Schema check error: {schema_e}")
    
    # Test auth signup with minimal data
    try:
        print("Testing basic auth signup...")
        auth_response = supabase.auth.sign_up({
            "email": "testuser123@gmail.com",
            "password": "TestPassword123!"
        })
        print(f"✅ Auth signup successful: {auth_response.user.id if auth_response.user else 'No user'}")
        
        if auth_response.user:
            # Try to insert minimal user data
            try:
                user_data = {
                    "id": auth_response.user.id,
                    "email": "testuser123@gmail.com"
                }
                result = supabase.table("users").insert(user_data).execute()
                print(f"✅ User data inserted: {result.data}")
            except Exception as insert_e:
                print(f"❌ User data insert error: {insert_e}")
                
    except Exception as auth_e:
        print(f"❌ Auth signup error: {auth_e}")

except Exception as e:
    print(f"❌ Failed to create Supabase client: {e}")