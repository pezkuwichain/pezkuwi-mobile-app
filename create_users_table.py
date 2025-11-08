#!/usr/bin/env python3
"""
Create users table in Supabase via SQL
"""

import os
import requests
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

# SQL to create users table
sql = """
-- Drop existing table if needed
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  referral_code TEXT,
  language TEXT DEFAULT 'en',
  tiki_count INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 0,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role has full access" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;

-- Service role can do everything
CREATE POLICY "Service role has full access" ON public.users
  FOR ALL USING (true);

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
"""

# Execute via Supabase SQL endpoint
url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# Try direct SQL execution via PostgREST
# Note: This might not work, we need to use the SQL Editor in Supabase Dashboard
print("⚠️  To create the users table, please run this SQL in Supabase SQL Editor:")
print("=" * 80)
print(sql)
print("=" * 80)
print("\n📍 Go to: https://vsyrpfiwhjvahofxwytr.supabase.co/project/_/sql/new")
print("Paste the SQL above and click 'Run'")
