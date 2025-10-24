import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';
import * as SecureStore from 'expo-secure-store';

// PezkuwiChain node endpoint
const PEZKUWI_NODE_URL = 'wss://pezkuwichain.io'; // Replace with actual node URL

interface WalletData {
  address: string;
  mnemonic: string;
  publicKey: string;
}

class WalletService {
  private static instance: WalletService;
  private api: ApiPromise | null = null;
  private keyring: Keyring | null = null;
  private currentAccount: any = null;

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Initialize connection to PezkuwiChain node
   */
  async initialize(): Promise<void> {
    try {
      if (this.api) {
        return; // Already initialized
      }

      // Connect to PezkuwiChain node
      const provider = new WsProvider(PEZKUWI_NODE_URL);
      this.api = await ApiPromise.create({ provider });

      // Initialize keyring
      this.keyring = new Keyring({ type: 'sr25519', ss58Format: 42 }); // ss58Format for Substrate

      console.log('WalletService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WalletService:', error);
      // For development, continue without blockchain connection
      this.keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    }
  }

  /**
   * Create new wallet with mnemonic
   */
  async createWallet(mnemonic?: string): Promise<WalletData> {
    try {
      await this.initialize();

      // Generate or use provided mnemonic
      const walletMnemonic = mnemonic || mnemonicGenerate(12);

      // Validate mnemonic
      if (!mnemonicValidate(walletMnemonic)) {
        throw new Error('Invalid mnemonic phrase');
      }

      // Create account from mnemonic
      const account = this.keyring!.addFromMnemonic(walletMnemonic);

      // Store wallet data securely
      await this.storeWallet({
        address: account.address,
        mnemonic: walletMnemonic,
        publicKey: account.publicKey.toString(),
      });

      this.currentAccount = account;

      return {
        address: account.address,
        mnemonic: walletMnemonic,
        publicKey: account.publicKey.toString(),
      };
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  }

  /**
   * Import wallet from mnemonic
   */
  async importWallet(mnemonic: string): Promise<WalletData> {
    return this.createWallet(mnemonic);
  }

  /**
   * Get current wallet address
   */
  async getAddress(): Promise<string | null> {
    try {
      const walletData = await this.getWallet();
      return walletData?.address || null;
    } catch (error) {
      console.error('Failed to get address:', error);
      return null;
    }
  }

  /**
   * Get wallet balance for HEZ and PEZ tokens
   */
  async getBalance(): Promise<{ hez: string; pez: string }> {
    try {
      if (!this.api || !this.currentAccount) {
        await this.loadWallet();
      }

      if (!this.api || !this.currentAccount) {
        return { hez: '0', pez: '0' };
      }

      // Get HEZ balance (native token)
      const { data: balance } = await this.api.query.system.account(
        this.currentAccount.address
      );
      const hezBalance = balance.free.toString();

      // Get PEZ balance (governance token from pallet-pez-treasury)
      let pezBalance = '0';
      try {
        const pezData = await this.api.query.pezTreasury.balances(
          this.currentAccount.address
        );
        pezBalance = pezData.toString();
      } catch (error) {
        console.log('PEZ balance not available');
      }

      return {
        hez: this.formatBalance(hezBalance),
        pez: this.formatBalance(pezBalance),
      };
    } catch (error) {
      console.error('Failed to get balance:', error);
      return { hez: '0', pez: '0' };
    }
  }

  /**
   * Send tokens
   */
  async sendTokens(
    to: string,
    amount: string,
    token: 'HEZ' | 'PEZ'
  ): Promise<string> {
    try {
      if (!this.api || !this.currentAccount) {
        await this.loadWallet();
      }

      if (!this.api || !this.currentAccount) {
        throw new Error('Wallet not initialized');
      }

      let txHash: string;

      if (token === 'HEZ') {
        // Send HEZ (native token)
        const transfer = this.api.tx.balances.transfer(to, amount);
        const hash = await transfer.signAndSend(this.currentAccount);
        txHash = hash.toString();
      } else {
        // Send PEZ (governance token)
        const transfer = this.api.tx.pezTreasury.transfer(to, amount);
        const hash = await transfer.signAndSend(this.currentAccount);
        txHash = hash.toString();
      }

      return txHash;
    } catch (error) {
      console.error('Failed to send tokens:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(): Promise<any[]> {
    try {
      if (!this.api || !this.currentAccount) {
        await this.loadWallet();
      }

      if (!this.api || !this.currentAccount) {
        return [];
      }

      // Query recent transactions
      // This is a simplified version - actual implementation would query events
      const events = await this.api.query.system.events();
      
      // Filter and format transactions
      const transactions = events
        .filter((record: any) => {
          const { event } = record;
          return (
            event.section === 'balances' ||
            event.section === 'pezTreasury'
          );
        })
        .map((record: any, index: number) => ({
          id: `tx-${index}`,
          type: record.event.method,
          amount: '0', // Parse from event data
          timestamp: Date.now() - index * 3600000,
          status: 'confirmed',
        }));

      return transactions;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  /**
   * Check if wallet exists
   */
  async hasWallet(): Promise<boolean> {
    try {
      const address = await SecureStore.getItemAsync('wallet_address');
      return !!address;
    } catch (error) {
      console.error('Failed to check wallet existence:', error);
      return false;
    }
  }

  /**
   * Load existing wallet
   */
  async loadWallet(): Promise<void> {
    try {
      await this.initialize();

      const walletData = await this.getWallet();
      if (!walletData) {
        throw new Error('No wallet found');
      }

      // Restore account from mnemonic
      this.currentAccount = this.keyring!.addFromMnemonic(walletData.mnemonic);

      console.log('Wallet loaded successfully');
    } catch (error) {
      console.error('Failed to load wallet:', error);
      throw error;
    }
  }

  /**
   * Delete wallet (logout)
   */
  async deleteWallet(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('wallet_address');
      await SecureStore.deleteItemAsync('wallet_mnemonic');
      await SecureStore.deleteItemAsync('wallet_publicKey');
      
      this.currentAccount = null;
      
      console.log('Wallet deleted successfully');
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      throw error;
    }
  }

  /**
   * Store wallet data securely
   */
  private async storeWallet(data: WalletData): Promise<void> {
    try {
      await SecureStore.setItemAsync('wallet_address', data.address);
      await SecureStore.setItemAsync('wallet_mnemonic', data.mnemonic);
      await SecureStore.setItemAsync('wallet_publicKey', data.publicKey);
    } catch (error) {
      console.error('Failed to store wallet:', error);
      throw error;
    }
  }

  /**
   * Get stored wallet data
   */
  private async getWallet(): Promise<WalletData | null> {
    try {
      const address = await SecureStore.getItemAsync('wallet_address');
      const mnemonic = await SecureStore.getItemAsync('wallet_mnemonic');
      const publicKey = await SecureStore.getItemAsync('wallet_publicKey');

      if (!address || !mnemonic || !publicKey) {
        return null;
      }

      return { address, mnemonic, publicKey };
    } catch (error) {
      console.error('Failed to get wallet:', error);
      return null;
    }
  }

  /**
   * Format balance for display
   */
  private formatBalance(balance: string): string {
    try {
      // Convert from smallest unit to main unit (assuming 12 decimals)
      const num = BigInt(balance);
      const divisor = BigInt(10 ** 12);
      const main = num / divisor;
      const fraction = num % divisor;
      
      // Format with 2 decimal places
      const fractionStr = fraction.toString().padStart(12, '0').slice(0, 2);
      return `${main}.${fractionStr}`;
    } catch (error) {
      return '0.00';
    }
  }

  /**
   * Get API instance
   */
  getApi(): ApiPromise | null {
    return this.api;
  }

  /**
   * Get current account
   */
  getCurrentAccount(): any {
    return this.currentAccount;
  }
}

export default WalletService.getInstance();

