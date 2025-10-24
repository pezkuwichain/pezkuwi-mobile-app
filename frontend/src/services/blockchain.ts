/**
 * PezkuwiChain Blockchain Service
 * Handles all interactions with the PezkuwiChain blockchain via Polkadot.js
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { CURRENT_CHAIN_CONFIG, ASSET_IDS } from '../constants/blockchain';
import { Balance, Transaction, Proposal } from '../types';

class BlockchainService {
  private api: ApiPromise | null = null;
  private provider: WsProvider | null = null;
  private isConnected: boolean = false;

  /**
   * Initialize connection to PezkuwiChain
   */
  async connect(): Promise<boolean> {
    try {
      console.log(`Connecting to ${CURRENT_CHAIN_CONFIG.name}...`);
      console.log(`RPC URL: ${CURRENT_CHAIN_CONFIG.rpcUrl}`);

      this.provider = new WsProvider(CURRENT_CHAIN_CONFIG.rpcUrl);
      this.api = await ApiPromise.create({ provider: this.provider });

      await this.api.isReady;
      this.isConnected = true;

      console.log('✅ Connected to PezkuwiChain');
      console.log(`Chain: ${await this.api.rpc.system.chain()}`);
      console.log(`Node: ${await this.api.rpc.system.name()}`);
      console.log(`Version: ${await this.api.rpc.system.version()}`);

      return true;
    } catch (error) {
      console.error('❌ Failed to connect to PezkuwiChain:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Disconnect from blockchain
   */
  async disconnect(): Promise<void> {
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
      this.provider = null;
      this.isConnected = false;
      console.log('Disconnected from PezkuwiChain');
    }
  }

  /**
   * Check if connected to blockchain
   */
  isApiConnected(): boolean {
    return this.isConnected && this.api !== null;
  }

  /**
   * Get API instance (throws if not connected)
   */
  private getApi(): ApiPromise {
    if (!this.api || !this.isConnected) {
      throw new Error('Not connected to blockchain. Call connect() first.');
    }
    return this.api;
  }

  /**
   * Get account balances (HEZ and PEZ)
   */
  async getBalances(address: string): Promise<Balance> {
    try {
      const api = this.getApi();

      // Get HEZ balance (native token)
      const { data: hezBalance } = await api.query.system.account(address);
      const hezFree = hezBalance.free.toString();
      const hezReserved = hezBalance.reserved.toString();

      // Get PEZ balance (asset)
      const pezBalance = await api.query.assets.account(ASSET_IDS.PEZ, address);
      const pezFree = pezBalance.isSome ? pezBalance.unwrap().balance.toString() : '0';

      // Get staked HEZ
      const stakingInfo = await api.query.staking.ledger(address);
      const hezStaked = stakingInfo.isSome ? stakingInfo.unwrap().active.toString() : '0';

      // Calculate governance power (PEZ balance as percentage)
      const totalPezSupply = '5000000000000000000000'; // 5 billion
      const governancePower = (parseFloat(pezFree) / parseFloat(totalPezSupply) * 100).toFixed(2);

      // Mock USD values (would come from price oracle in production)
      const hezUsd = (parseFloat(hezFree) / 1e12 * 1.0).toFixed(2);
      const pezUsd = (parseFloat(pezFree) / 1e12 * 0.1).toFixed(2);

      return {
        hez: this.formatBalance(hezFree, 12),
        pez: this.formatBalance(pezFree, 12),
        hezStaked: this.formatBalance(hezStaked, 12),
        hezUsd,
        pezUsd,
        governancePower,
      };
    } catch (error) {
      console.error('Error fetching balances:', error);
      // Return mock data if blockchain not available
      return this.getMockBalances();
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(address: string, limit: number = 10): Promise<Transaction[]> {
    try {
      // This would query blockchain events and filter for transfers
      // For now, return mock data
      return this.getMockTransactions();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return this.getMockTransactions();
    }
  }

  /**
   * Get active governance proposals
   */
  async getProposals(): Promise<Proposal[]> {
    try {
      const api = this.getApi();
      
      // Query welati pallet for active proposals
      const proposals = await api.query.welati.proposals.entries();
      
      return proposals.map(([key, value]: any) => {
        const proposalId = key.args[0].toNumber();
        const proposal = value.unwrap();
        
        return {
          id: proposalId,
          title: `Proposal ${proposalId}`,
          description: proposal.description?.toString() || 'No description',
          proposer: proposal.proposer.toString(),
          votingDeadline: proposal.deadline.toNumber(),
          yesVotes: proposal.yesVotes.toString(),
          noVotes: proposal.noVotes.toString(),
          status: proposal.status.toString() as any,
        };
      });
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return this.getMockProposals();
    }
  }

  /**
   * Send HEZ or PEZ tokens
   */
  async sendTokens(
    from: string,
    to: string,
    amount: string,
    token: 'HEZ' | 'PEZ',
    signer: any
  ): Promise<string> {
    try {
      const api = this.getApi();
      
      let tx;
      if (token === 'HEZ') {
        tx = api.tx.balances.transfer(to, amount);
      } else {
        tx = api.tx.assets.transfer(ASSET_IDS.PEZ, to, amount);
      }

      const hash = await tx.signAndSend(signer);
      return hash.toString();
    } catch (error) {
      console.error('Error sending tokens:', error);
      throw error;
    }
  }

  /**
   * Stake HEZ tokens
   */
  async stakeTokens(
    address: string,
    amount: string,
    signer: any
  ): Promise<string> {
    try {
      const api = this.getApi();
      const tx = api.tx.staking.bond(address, amount, 'Staked');
      const hash = await tx.signAndSend(signer);
      return hash.toString();
    } catch (error) {
      console.error('Error staking tokens:', error);
      throw error;
    }
  }

  /**
   * Vote on governance proposal
   */
  async voteOnProposal(
    proposalId: number,
    vote: 'yes' | 'no',
    amount: string,
    signer: any
  ): Promise<string> {
    try {
      const api = this.getApi();
      const tx = api.tx.welati.vote(proposalId, vote === 'yes', amount);
      const hash = await tx.signAndSend(signer);
      return hash.toString();
    } catch (error) {
      console.error('Error voting on proposal:', error);
      throw error;
    }
  }

  /**
   * Format balance with decimals
   */
  private formatBalance(balance: string, decimals: number): string {
    const value = parseFloat(balance) / Math.pow(10, decimals);
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  /**
   * Mock data for development/testing
   */
  private getMockBalances(): Balance {
    return {
      hez: '45,750.5',
      pez: '1,234,567',
      hezStaked: '30,000',
      hezUsd: '45,234',
      pezUsd: '123,456',
      governancePower: '2.5',
    };
  }

  private getMockTransactions(): Transaction[] {
    return [
      {
        id: '1',
        type: 'send' as any,
        amount: '500',
        token: 'HEZ',
        from: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        to: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        timestamp: Date.now() - 86400000,
        blockNumber: 123456,
        hash: '0x1234567890abcdef',
        status: 'confirmed',
      },
      {
        id: '2',
        type: 'receive' as any,
        amount: '300',
        token: 'PEZ',
        from: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        to: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        timestamp: Date.now() - 172800000,
        blockNumber: 123450,
        hash: '0xabcdef1234567890',
        status: 'confirmed',
      },
    ];
  }

  private getMockProposals(): Proposal[] {
    return [
      {
        id: 1,
        title: 'Proposal 1',
        description: 'Description of proposal 1',
        proposer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        votingDeadline: Date.now() + 172800000,
        yesVotes: '10400',
        noVotes: '4600',
        status: 'active',
      },
      {
        id: 2,
        title: 'Proposal 2',
        description: 'Description of proposal 2',
        proposer: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
        votingDeadline: Date.now() + 432000000,
        yesVotes: '198',
        noVotes: '0',
        status: 'active',
      },
    ];
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;

