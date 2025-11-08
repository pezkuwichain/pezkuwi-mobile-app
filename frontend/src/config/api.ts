// API Configuration
// Single source of truth for backend URL

const getBackendUrl = (): string => {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  
  if (!url) {
    console.error('⚠️ EXPO_PUBLIC_BACKEND_URL not set! Using fallback.');
    return 'http://localhost:8001';
  }
  
  console.log('✅ Backend URL:', url);
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
