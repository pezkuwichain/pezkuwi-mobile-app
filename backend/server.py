from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from substrateinterface import SubstrateInterface
from supabase import create_client, Client


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging FIRST
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Polkadot RPC endpoint (Tunneled Local Node)
POLKADOT_RPC = "wss://tired-candies-sniff.loca.lt"

# Initialize Substrate connection
substrate = None

# Supabase connection
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY = os.environ.get('TURNSTILE_SECRET_KEY')

# Test Wallet Address (with funds)
TEST_WALLET_ADDRESS = "5GgTgG9sRmPQAYU1RsTejZYnZRjwzKZKWD3awtuqjHioki45"

def get_substrate():
    global substrate
    if substrate is None:
        try:
            substrate = SubstrateInterface(url=POLKADOT_RPC)
            logger.info(f"✅ Connected to blockchain: {substrate.chain}, {substrate.name}")
        except Exception as e:
            logger.error(f"❌ Failed to connect to blockchain: {e}")
            substrate = None
    return substrate

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class WalletBalanceRequest(BaseModel):
    address: str

class WalletBalanceResponse(BaseModel):
    address: str
    hez: str
    pez: str
    transferrable: str
    reserved: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Auth Models
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: str
    referral_code: Optional[str] = None
    language: str = "en"

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    user_id: str
    email: str
    access_token: str
    refresh_token: str
    first_name: str
    last_name: str

class TurnstileVerifyRequest(BaseModel):
    token: str

class TurnstileVerifyResponse(BaseModel):
    success: bool
    message: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "PezkuwiChain Mobile API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ========================================
# BLOCKCHAIN API ENDPOINTS
# ========================================

@api_router.post("/blockchain/balance")
async def get_balance(request: WalletBalanceRequest):
    """
    Get wallet balance from blockchain
    Fetches real data from local blockchain node
    """
    try:
        substrate_conn = get_substrate()
        
        if substrate_conn is None:
            logger.warning("Blockchain connection not available, using mock data")
            return WalletBalanceResponse(
                address=request.address,
                hez="1000.0000",
                pez="5000.0000",
                transferrable="800.0000",
                reserved="200.0000"
            )
        
        # Get native token (HEZ) balance
        account_info = substrate_conn.query('System', 'Account', [request.address])
        
        if account_info.value:
            # Native balance (HEZ)
            free_balance = account_info.value['data']['free']
            reserved_balance = account_info.value['data']['reserved']
            
            # Convert from planck to HEZ (12 decimals)
            hez_balance = free_balance / (10 ** 12)
            reserved_hez = reserved_balance / (10 ** 12)
            transferrable_hez = hez_balance - reserved_hez
            
            logger.info(f"✅ Balance fetched for {request.address[:10]}...")
        else:
            logger.warning(f"⚠️ Account not found: {request.address}")
            hez_balance = 0
            reserved_hez = 0
            transferrable_hez = 0
        
        # Get PEZ balance (Asset ID: 1)
        try:
            pez_account = substrate_conn.query('Assets', 'Account', [1, request.address])
            if pez_account.value:
                pez_balance = pez_account.value['balance'] / (10 ** 12)
            else:
                pez_balance = 0
        except Exception as e:
            logger.warning(f"PEZ balance query failed: {e}")
            pez_balance = 0
        
        return WalletBalanceResponse(
            address=request.address,
            hez=f"{hez_balance:.4f}",
            pez=f"{pez_balance:.4f}",
            transferrable=f"{transferrable_hez:.4f}",
            reserved=f"{reserved_hez:.4f}"
        )
        
    except Exception as e:
        logger.error(f"Error fetching balance: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/blockchain/transactions/{address}")
async def get_transactions(address: str):
    """
    Get transaction history for an address
    """
    try:
        # Mock data for now
        return {
            "address": address,
            "transactions": [
                {
                    "hash": "0x123...",
                    "from": address,
                    "to": "5GrwvaEF5zXb26Fz9rc...",
                    "amount": "100.0000",
                    "asset": "HEZ",
                    "timestamp": datetime.utcnow().isoformat(),
                    "status": "success"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching transactions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/citizenship/status/{address}")
async def get_citizenship_status(address: str):
    """
    Get citizenship status for an address
    """
    try:
        # Mock data
        return {
            "address": address,
            "hasApplied": False,
            "isApproved": False,
            "hasTiki": False,
            "tikiNumber": None,
            "region": None,
            "nextAction": "APPLY_KYC"
        }
    except Exception as e:
        logger.error(f"Error fetching citizenship status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/governance/proposals")
async def get_proposals():
    """
    Get active governance proposals
    """
    try:
        # Mock data
        return {
            "proposals": [
                {
                    "id": "1",
                    "title": "Increase PEZ Rewards",
                    "description": "Proposal to increase monthly PEZ rewards by 10%",
                    "proposer": "5GrwvaEF5zXb26Fz9rc...",
                    "votesYes": 150,
                    "votesNo": 30,
                    "deadline": datetime.utcnow().isoformat(),
                    "status": "active"
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching proposals: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# TURNSTILE VERIFICATION ENDPOINT
# ========================================

@api_router.post("/verify-turnstile", response_model=TurnstileVerifyResponse)
async def verify_turnstile(request: TurnstileVerifyRequest):
    """
    Verify Cloudflare Turnstile token
    """
    try:
        import httpx
        
        # Verify with Cloudflare API
        verify_url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                verify_url,
                json={
                    "secret": TURNSTILE_SECRET_KEY,
                    "response": request.token,
                }
            )
            
            result = response.json()
            
            if result.get("success"):
                logger.info("✅ Turnstile verification successful")
                return TurnstileVerifyResponse(
                    success=True,
                    message="Verification successful"
                )
            else:
                logger.warning(f"⚠️ Turnstile verification failed: {result}")
                return TurnstileVerifyResponse(
                    success=False,
                    message="Verification failed"
                )
                
    except Exception as e:
        logger.error(f"Error verifying turnstile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========================================
# AUTHENTICATION API ENDPOINTS
# ========================================

@api_router.post("/auth/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    """
    Sign up a new user with Supabase
    """
    try:
        # Sign up with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Failed to create user")
        
        # Store additional user data in Supabase users table
        user_data = {
            "id": auth_response.user.id,
            "email": request.email,
            "first_name": request.first_name,
            "last_name": request.last_name,
            "phone": request.phone,
            "referral_code": request.referral_code,
            "language": request.language,
            "wallet_address": TEST_WALLET_ADDRESS,  # Assign test wallet to new users
            "created_at": datetime.utcnow().isoformat(),
            "tiki_count": 0,
            "trust_score": 0
        }
        
        supabase.table("users").insert(user_data).execute()
        
        logger.info(f"✅ User signed up: {request.email}")
        
        # Check if session exists (may be None if email confirmation is required)
        if auth_response.session:
            access_token = auth_response.session.access_token
            refresh_token = auth_response.session.refresh_token
        else:
            # If no session (email confirmation required), return empty tokens
            access_token = ""
            refresh_token = ""
            logger.warning(f"No session created for {request.email} - email confirmation may be required")
        
        return AuthResponse(
            user_id=auth_response.user.id,
            email=request.email,
            access_token=access_token,
            refresh_token=refresh_token,
            first_name=request.first_name,
            last_name=request.last_name
        )
        
    except Exception as e:
        logger.error(f"Error during signup: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/signin", response_model=AuthResponse)
async def signin(request: SignInRequest):
    """
    Sign in an existing user
    """
    try:
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Get user data from Supabase
        user_data = supabase.table("users").select("*").eq("id", auth_response.user.id).execute()
        
        if not user_data.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        user_profile = user_data.data[0]
        
        logger.info(f"✅ User signed in: {request.email}")
        
        return AuthResponse(
            user_id=auth_response.user.id,
            email=request.email,
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            first_name=user_profile.get("first_name", ""),
            last_name=user_profile.get("last_name", "")
        )
        
    except Exception as e:
        logger.error(f"Error during signin: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@api_router.get("/auth/user/{user_id}")
async def get_user_profile(user_id: str):
    """
    Get user profile data
    """
    try:
        user_data = supabase.table("users").select("*").eq("id", user_id).execute()
        
        if not user_data.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user_data.data[0]
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
