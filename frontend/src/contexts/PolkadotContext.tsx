import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentEndpoint, WALLET_ERRORS } from '../lib/wallet';

// WalletConnect imports
import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

// Platform-aware Polkadot.js import for reading blockchain data
// Only import on native platforms (not web)
let ApiPromise: any = null;
let WsProvider: any = null;

if (Platform.OS !== 'web') {
  try {
    const polkadotApi = require('@polkadot/api');
    
    ApiPromise = polkadotApi.ApiPromise;
    WsProvider = polkadotApi.WsProvider;
    
    console.log('✅ Polkadot.js loaded for reading blockchain data');
  } catch (error) {
    console.warn('⚠️ Polkadot.js not available:', error);
  }
}

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface ConnectedAccount {
  address: string;
  name?: string;
  source: 'walletconnect';
}

interface PolkadotContextType {
  // Blockchain API (read-only)
  api: any | null;
  isApiReady: boolean;
  
  // WalletConnect
  isConnected: boolean;
  accounts: ConnectedAccount[];
  selectedAccount: ConnectedAccount | null;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  
  // State
  error: string | null;
  isLoading: boolean;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

// ========================================
// WALLETCONNECT CONFIGURATION
// ========================================

const projectId = 'e542ff314e26ff34de2d4fba98db70bb'; // PezkuwiChain WalletConnect Project ID

const providerMetadata = {
  name: 'PezkuwiChain',
  description: 'Kurdish Digital Citizenship Platform',
  url: 'https://www.pezkuwichain.io',
  icons: ['https://www.pezkuwichain.io/logo.png'],
  redirect: {
    native: 'pezkuwichain://',
    universal: 'https://www.pezkuwichain.io',
  },
};

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
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<ConnectedAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const rpcEndpoint = endpoint || getCurrentEndpoint();

  // ========================================
  // BLOCKCHAIN API INITIALIZATION (READ-ONLY)
  // ========================================
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      console.log('📱 Web platform - using mock mode for blockchain API');
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

        console.log('🔗 Connecting to PezkuwiChain RPC:', rpcEndpoint);
        
        const provider = new WsProvider(rpcEndpoint);
        const apiInstance = await ApiPromise.create({ provider });
        
        await apiInstance.isReady;
        
        setApi(apiInstance);
        setIsApiReady(true);
        setError(null);
        
        console.log('✅ Connected to PezkuwiChain for reading blockchain data');
        
        // Get chain info
        const [chain, nodeName, nodeVersion] = await Promise.all([
          apiInstance.rpc.system.chain(),
          apiInstance.rpc.system.name(),
          apiInstance.rpc.system.version(),
        ]);
        
        console.log(`📡 Chain: ${chain}`);
        console.log(`🖥️  Node: ${nodeName} v${nodeVersion}`);
        
      } catch (err: any) {
        console.error('❌ Failed to connect to blockchain RPC:', err);
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

  // ========================================
  // WALLETCONNECT: CONNECT WALLET
  // ========================================
  
  const connectWallet = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (Platform.OS === 'web') {
        Alert.alert(
          'Not Available on Web',
          'Please use SubWallet browser extension for web, or use the mobile app.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }

      console.log('🔗 Opening WalletConnect modal...');
      
      // WalletConnect Modal will handle the connection
      // User will see QR code or list of supported wallets (SubWallet, Nova Wallet, etc.)
      // This is handled by the WalletConnectModal component in the UI
      
      Alert.alert(
        'Connect Wallet',
        'Please scan QR code with SubWallet or Nova Wallet mobile app',
        [{ text: 'OK' }]
      );
      
      setIsLoading(false);
      
    } catch (err: any) {
      console.error('❌ Wallet connection failed:', err);
      setError(WALLET_ERRORS.CONNECTION_FAILED);
      setIsLoading(false);
    }
  };

  // ========================================
  // WALLETCONNECT: SESSION HANDLER
  // ========================================
  
  const handleSessionUpdate = (session: any) => {
    console.log('✅ WalletConnect session established');
    
    // Extract accounts from session
    const namespaces = session.namespaces;
    const polkadotAccounts = namespaces?.polkadot?.accounts || [];
    
    const connectedAccounts: ConnectedAccount[] = polkadotAccounts.map((acc: string) => {
      // Format: "polkadot:chainId:address"
      const parts = acc.split(':');
      const address = parts[parts.length - 1];
      
      return {
        address,
        source: 'walletconnect' as const,
      };
    });

    if (connectedAccounts.length > 0) {
      setAccounts(connectedAccounts);
      setSelectedAccount(connectedAccounts[0]);
      setIsConnected(true);
      
      // Save session
      AsyncStorage.setItem('wc_session', JSON.stringify(session));
      
      console.log(`✅ Connected ${connectedAccounts.length} account(s)`);
    }
  };

  // ========================================
  // WALLETCONNECT: DISCONNECT
  // ========================================
  
  const disconnectWallet = async () => {
    try {
      setAccounts([]);
      setSelectedAccount(null);
      setIsConnected(false);
      
      // Clear session
      await AsyncStorage.removeItem('wc_session');
      
      console.log('🔌 Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  // ========================================
  // CONTEXT VALUE
  // ========================================
  
  const value: PolkadotContextType = {
    // Blockchain API (read-only)
    api,
    isApiReady,
    
    // WalletConnect
    isConnected,
    accounts,
    selectedAccount,
    
    // Actions
    connectWallet,
    disconnectWallet,
    
    // State
    error,
    isLoading,
  };

  return (
    <PolkadotContext.Provider value={value}>
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
        onSessionUpdate={handleSessionUpdate}
      />
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
