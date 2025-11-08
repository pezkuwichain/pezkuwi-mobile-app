#!/usr/bin/env python3
"""
Check what columns exist in the Supabase users table
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

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Try to get the table structure by selecting with limit 0
    try:
        result = supabase.table("users").select("*").limit(0).execute()
        print("✅ Users table accessible")
        print(f"Table data structure: {result}")
        
        # Try to get any existing data to see the structure
        result_with_data = supabase.table("users").select("*").limit(1).execute()
        if result_with_data.data:
            print(f"Sample data structure: {result_with_data.data[0].keys()}")
        else:
            print("No existing data in users table")
            
    except Exception as e:
        print(f"❌ Users table access error: {e}")
        
    # Try to insert with just id and email to see what's required
    try:
        import uuid
        test_id = str(uuid.uuid4())
        minimal_data = {
            "id": test_id,
            "email": f"test{test_id[:8]}@gmail.com"
        }
        result = supabase.table("users").insert(minimal_data).execute()
        print(f"✅ Minimal insert successful: {result.data}")
    except Exception as e:
        error_str = str(e)
        if "row-level security" in error_str:
            print("❌ RLS policy prevents insert (expected with anon key)")
        elif "column" in error_str and "does not exist" in error_str:
            print(f"❌ Column doesn't exist: {error_str}")
        else:
            print(f"❌ Insert error: {error_str}")

except Exception as e:
    print(f"❌ Failed to create Supabase client: {e}")