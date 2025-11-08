import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import { getCurrentEndpoint, WALLET_ERRORS } from '../lib/wallet';

// Platform-aware imports
let ApiPromise: any = null;
let WsProvider: any = null;

if (Platform.OS !== 'web') {
  // Native: Use Polkadot.js
  try {
    const polkadotApi = require('@polkadot/api');
    ApiPromise = polkadotApi.ApiPromise;
    WsProvider = polkadotApi.WsProvider;
    console.log('✅ Polkadot.js loaded (Native)');
  } catch (error) {
    console.warn('⚠️ Polkadot.js not available');
  }
} else {
  // Web: Use Polkadot.js (will be imported normally)
  const polkadotApi = require('@polkadot/api');
  ApiPromise = polkadotApi.ApiPromise;
  WsProvider = polkadotApi.WsProvider;
}

// ========================================
// TYPES
// ========================================

export interface Account {
  address: string;
  name?: string;
  source?: string;
}

interface PolkadotContextType {
  api: any | null;
  isApiReady: boolean;
  accounts: Account[];
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

// ========================================
// PROVIDER
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rpcEndpoint = endpoint || getCurrentEndpoint();

  // Initialize Polkadot API (Blockchain RPC connection)
  useEffect(() => {
    const initApi = async () => {
      try {
        if (!ApiPromise || !WsProvider) {
          console.warn('⚠️ Polkadot.js not available');
          setIsApiReady(false);
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
        setError(`Failed to connect: ${rpcEndpoint}`);
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

  // Connect wallet
  const connectWallet = async () => {
    try {
      setError(null);
      
      if (Platform.OS === 'web') {
        // Web: Use Polkadot.js extension
        const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp');
        
        const extensions = await web3Enable('PezkuwiChain');
        
        if (extensions.length === 0) {
          Alert.alert(
            'Extension Required',
            'Please install Polkadot.js extension',
            [{ text: 'OK' }]
          );
          return;
        }
        
        console.log('✅ Polkadot.js extension enabled');
        
        const allAccounts = await web3Accounts();
        
        if (allAccounts.length === 0) {
          Alert.alert(
            'No Accounts',
            'Please create an account in Polkadot.js extension',
            [{ text: 'OK' }]
          );
          return;
        }
        
        const mappedAccounts: Account[] = allAccounts.map(acc => ({
          address: acc.address,
          name: acc.meta.name,
          source: acc.meta.source,
        }));
        
        setAccounts(mappedAccounts);
        setSelectedAccount(mappedAccounts[0]);
        
        console.log(`✅ Connected ${mappedAccounts.length} account(s)`);
        
      } else {
        // Native: Show instruction
        Alert.alert(
          'Wallet Connection',
          'Please enter your wallet address in the app to view your assets. For transactions, you will be guided to SubWallet.',
          [{ text: 'OK' }]
        );
      }
      
    } catch (err: any) {
      console.error('❌ Wallet connection failed:', err);
      setError(WALLET_ERRORS.CONNECTION_FAILED);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccounts([]);
    setSelectedAccount(null);
    console.log('🔌 Wallet disconnected');
  };

  const value: PolkadotContextType = {
    api,
    isApiReady,
    accounts,
    selectedAccount,
    setSelectedAccount,
    connectWallet,
    disconnectWallet,
    error,
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
