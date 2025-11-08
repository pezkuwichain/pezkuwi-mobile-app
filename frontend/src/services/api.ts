// PezkuwiChain API Service
// Connects to our FastAPI backend (proxy to blockchain)

import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';
const API_BASE = `${BACKEND_URL}/api`;

interface WalletBalance {
  address: string;
  hez: string;
  pez: string;
  transferrable: string;
  reserved: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  asset: string;
  timestamp: string;
  status: string;
}

class PezkuwiAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
    console.log('✅ PezkuwiAPI initialized:', this.baseUrl);
  }

  // Get wallet balance
  async getBalance(address: string): Promise<WalletBalance> {
    try {
      const response = await fetch(`${this.baseUrl}/blockchain/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactions(address: string): Promise<{ address: string; transactions: Transaction[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/blockchain/transactions/${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Get citizenship status
  async getCitizenshipStatus(address: string) {
    try {
      const response = await fetch(`${this.baseUrl}/citizenship/status/${address}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch citizenship status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching citizenship status:', error);
      throw error;
    }
  }

  // Get governance proposals
  async getProposals() {
    try {
      const response = await fetch(`${this.baseUrl}/governance/proposals`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  }
}

export const pezkuwiAPI = new PezkuwiAPI();
export default pezkuwiAPI;
