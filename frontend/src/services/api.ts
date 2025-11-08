// PezkuwiChain API Service
// Connects to DKSweb backend running on localhost:8080

const API_BASE_URL = 'http://localhost:8080';

interface WalletBalance {
  address: string;
  hez: string;
  pez: string;
  usdt: string;
  transferrable: string;
  reserved: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  asset: string;
  timestamp: number;
  status: string;
}

class PezkuwiAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get wallet balance
  async getBalance(address: string): Promise<WalletBalance> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/${address}/balance`);
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
  async getTransactions(address: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/wallet/${address}/transactions`);
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
      const response = await fetch(`${this.baseUrl}/api/citizenship/${address}/status`);
      if (!response.ok) {
        throw new Error('Failed to fetch citizenship status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching citizenship status:', error);
      throw error;
    }
  }

  // Submit citizenship application
  async submitCitizenshipApplication(data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/api/citizenship/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      return await response.json();
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }

  // Get governance proposals
  async getProposals() {
    try {
      const response = await fetch(`${this.baseUrl}/api/governance/proposals`);
      if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  }

  // Vote on proposal
  async voteProposal(proposalId: string, vote: 'yes' | 'no', address: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/governance/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposalId,
          vote,
          address,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }
      return await response.json();
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  }

  // Get staking info
  async getStakingInfo(address: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/staking/${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch staking info');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching staking info:', error);
      throw error;
    }
  }
}

export const pezkuwiAPI = new PezkuwiAPI();
export default pezkuwiAPI;
