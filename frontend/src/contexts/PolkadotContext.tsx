import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getCurrentEndpoint, WALLET_ERRORS } from '../lib/wallet';

// Platform-aware Polkadot.js import
// Only import on native platforms (not web) to avoid import.meta issues
let ApiPromise: any = null;
let WsProvider: any = null;
let Keyring: any = null;
let web3Accounts: any = null;
let web3Enable: any = null;
let web3FromAddress: any = null;
let InjectedAccountWithMeta: any = null;

if (Platform.OS !== 'web') {
  try {
    const polkadotApi = require('@polkadot/api');
    const polkadotKeyring = require('@polkadot/keyring');
    
    ApiPromise = polkadotApi.ApiPromise;
    WsProvider = polkadotApi.WsProvider;
    Keyring = polkadotKeyring.Keyring;
    
    console.log('✅ Polkadot.js loaded for native platform');
  } catch (error) {
    console.warn('⚠️ Polkadot.js not available:', error);
  }
}

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface MobileAccount {
  address: string;
  name?: string;
  source?: 'local' | 'extension';
  meta?: {
    name?: string;
    source?: string;
  };
}

interface PolkadotContextType {
  api: any | null;
  isApiReady: boolean;
  accounts: MobileAccount[];
  selectedAccount: MobileAccount | null;
  setSelectedAccount: (account: MobileAccount | null) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  createWallet: (name: string, password: string) => Promise<{ success: boolean; error?: string; mnemonic?: string }>;
  importWallet: (mnemonic: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  error: string | null;
  isLoading: boolean;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

// ========================================
// PROVIDER COMPONENT
// ========================================

interface PolkadotProviderProps {
  children: ReactNode;
  endpoint?: string;
}

export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({
  children,
  endpoint,
}) => {
  const [api, setApi] = useState<any | null>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [accounts, setAccounts] = useState<MobileAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<MobileAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const rpcEndpoint = endpoint || getCurrentEndpoint();

  // ========================================
  // API INITIALIZATION
  // ========================================
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('📱 Web platform detected - using mock data');
      setIsApiReady(true);
      return;
    }

    const initApi = async () => {
      try {
        if (!ApiPromise || !WsProvider) {
          console.warn('⚠️ Polkadot.js not available, using mock mode');
          setIsApiReady(true);
          return;
        }

        console.log('🔗 Connecting to PezkuwiChain:', rpcEndpoint);
        
        const provider = new WsProvider(rpcEndpoint);
        const apiInstance = await ApiPromise.create({ provider });
        
        await apiInstance.isReady;
        
        setApi(apiInstance);
        setIsApiReady(true);
        setError(null);
        
        console.log('✅ Connected to PezkuwiChain');
        
        // Get chain info
        const [chain, nodeName, nodeVersion] = await Promise.all([
          apiInstance.rpc.system.chain(),
          apiInstance.rpc.system.name(),
          apiInstance.rpc.system.version(),
        ]);
        
        console.log(`📡 Chain: ${chain}`);
        console.log(`🖥️  Node: ${nodeName} v${nodeVersion}`);
        
      } catch (err: any) {
        console.error('❌ Failed to connect to node:', err);
        setError(`Failed to connect to node: ${rpcEndpoint}`);
        setIsApiReady(false);
      }
    };

    initApi();

    return () => {
      if (api) {
        api.disconnect();
      }
    };
  }, [rpcEndpoint]);

  // ========================================
  // LOAD SAVED ACCOUNTS
  // ========================================
  
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const savedAccounts = await AsyncStorage.getItem('pezkuwi_accounts');
      if (savedAccounts) {
        const parsedAccounts = JSON.parse(savedAccounts);
        setAccounts(parsedAccounts);
        
        // Auto-select first account if available
        if (parsedAccounts.length > 0 && !selectedAccount) {
          setSelectedAccount(parsedAccounts[0]);
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const saveAccounts = async (accountsList: MobileAccount[]) => {
    try {
      await AsyncStorage.setItem('pezkuwi_accounts', JSON.stringify(accountsList));
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  };

  // ========================================
  // CREATE WALLET (NEW ACCOUNT)
  // ========================================
  
  const createWallet = async (
    name: string,
    password: string
  ): Promise<{ success: boolean; error?: string; mnemonic?: string }> => {
    try {
      if (Platform.OS === 'web' || !Keyring) {
        return {
          success: false,
          error: 'Wallet creation not available on web platform',
        };
      }

      setIsLoading(true);
      
      // Generate mnemonic
      const { mnemonicGenerate } = await import('@polkadot/util-crypto');
      const mnemonic = mnemonicGenerate(12);
      
      // Create keyring
      const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
      const pair = keyring.addFromUri(mnemonic);
      
      const newAccount: MobileAccount = {
        address: pair.address,
        name: name || 'My Wallet',
        source: 'local',
        meta: {
          name: name || 'My Wallet',
          source: 'mobile',
        },
      };

      // Save encrypted mnemonic to secure store
      await SecureStore.setItemAsync(
        `pezkuwi_mnemonic_${pair.address}`,
        mnemonic
      );

      // Save password hash (for future unlocking)
      await SecureStore.setItemAsync(
        `pezkuwi_password_${pair.address}`,
        password // In production, hash this
      );

      // Add to accounts list
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      setSelectedAccount(newAccount);
      await saveAccounts(updatedAccounts);

      setIsLoading(false);

      return {
        success: true,
        mnemonic, // Return mnemonic for user to backup
      };
    } catch (error: any) {
      console.error('Error creating wallet:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error.message || 'Failed to create wallet',
      };
    }
  };

  // ========================================
  // IMPORT WALLET (FROM MNEMONIC)
  // ========================================
  
  const importWallet = async (
    mnemonic: string,
    name: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (Platform.OS === 'web' || !Keyring) {
        return {
          success: false,
          error: 'Wallet import not available on web platform',
        };
      }

      setIsLoading(true);

      // Validate mnemonic
      const { mnemonicValidate } = await import('@polkadot/util-crypto');
      if (!mnemonicValidate(mnemonic)) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Invalid mnemonic phrase',
        };
      }

      // Create keyring and import account
      const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
      const pair = keyring.addFromUri(mnemonic);

      // Check if account already exists
      const existingAccount = accounts.find(acc => acc.address === pair.address);
      if (existingAccount) {
        setIsLoading(false);
        return {
          success: false,
          error: 'This wallet is already imported',
        };
      }

      const newAccount: MobileAccount = {
        address: pair.address,
        name: name || 'Imported Wallet',
        source: 'local',
        meta: {
          name: name || 'Imported Wallet',
          source: 'mobile',
        },
      };

      // Save encrypted mnemonic
      await SecureStore.setItemAsync(
        `pezkuwi_mnemonic_${pair.address}`,
        mnemonic
      );

      // Save password
      await SecureStore.setItemAsync(
        `pezkuwi_password_${pair.address}`,
        password
      );

      // Add to accounts
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      setSelectedAccount(newAccount);
      await saveAccounts(updatedAccounts);

      setIsLoading(false);

      return { success: true };
    } catch (error: any) {
      console.error('Error importing wallet:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error.message || 'Failed to import wallet',
      };
    }
  };

  // ========================================
  // CONNECT WALLET
  // ========================================
  
  const connectWallet = async () => {
    try {
      setError(null);
      
      if (Platform.OS === 'web') {
        Alert.alert(
          'Web Platform',
          'Please use the mobile app to manage your wallet',
          [{ text: 'OK' }]
        );
        return;
      }

      // Check if we have any accounts
      if (accounts.length === 0) {
        Alert.alert(
          'No Wallet Found',
          'Please create or import a wallet first',
          [{ text: 'OK' }]
        );
        return;
      }

      // Auto-select first account if none selected
      if (!selectedAccount && accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }

      console.log('✅ Wallet connected');
      
    } catch (err: any) {
      console.error('❌ Wallet connection failed:', err);
      setError(WALLET_ERRORS.CONNECTION_FAILED);
    }
  };

  // ========================================
  // DISCONNECT WALLET
  // ========================================
  
  const disconnectWallet = () => {
    setSelectedAccount(null);
    console.log('🔌 Wallet disconnected');
  };

  // ========================================
  // CONTEXT VALUE
  // ========================================
  
  const value: PolkadotContextType = {
    api,
    isApiReady,
    accounts,
    selectedAccount,
    setSelectedAccount,
    connectWallet,
    disconnectWallet,
    createWallet,
    importWallet,
    error,
    isLoading,
  };

  return (
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  );
};

// ========================================
// HOOK
// ========================================

export const usePolkadot = (): PolkadotContextType => {
  const context = useContext(PolkadotContext);
  if (!context) {
    throw new Error('usePolkadot must be used within PolkadotProvider');
  }
  return context;
};
