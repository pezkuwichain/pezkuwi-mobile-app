// API Configuration
// Single source of truth for backend URL
import Constants from 'expo-constants';

const getBackendUrl = (): string => {
  // Try expo-constants first, then process.env, then fallback
  const url = Constants.expoConfig?.extra?.backendUrl || 
              process.env.EXPO_PUBLIC_BACKEND_URL;
  
  if (!url) {
    console.error('⚠️ Backend URL not found in expo-constants or env vars! Using fallback.');
    return 'http://localhost:8001';
  }
  
  console.log('✅ Backend URL loaded:', url);
  console.log('📱 Source: expo-constants =', Constants.expoConfig?.extra?.backendUrl);
  console.log('🔧 Source: process.env =', process.env.EXPO_PUBLIC_BACKEND_URL);
  return url;
};

export const API_BASE_URL = getBackendUrl();

export const API_ENDPOINTS = {
  AUTH_SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  AUTH_SIGNIN: `${API_BASE_URL}/api/auth/signin`,
  AUTH_USER: (userId: string) => `${API_BASE_URL}/api/auth/user/${userId}`,
  VERIFY_TURNSTILE: `${API_BASE_URL}/api/verify-turnstile`,
  BALANCE: `${API_BASE_URL}/api/blockchain/balance`,
};
