import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// TYPES - Simplified for backend proxy approach
// ========================================

export interface Account {
  address: string;
  name?: string;
}

interface PolkadotContextType {
  // No API connection - using backend proxy instead
  accounts: Account[];
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
  saveAccount: (account: Account) => Promise<void>;
  error: string | null;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

// ========================================
// PROVIDER - Simplified localStorage only
// ========================================

interface PolkadotProviderProps {
  children: ReactNode;
}

export const PolkadotProvider: React.FC<PolkadotProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved accounts from AsyncStorage
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
        if (parsedAccounts.length > 0) {
          setSelectedAccount(parsedAccounts[0]);
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      setError('Failed to load accounts');
    }
  };

  // Save account to AsyncStorage
  const saveAccount = async (account: Account) => {
    try {
      // Check if account already exists
      const existingIndex = accounts.findIndex(acc => acc.address === account.address);
      
      let updatedAccounts: Account[];
      if (existingIndex >= 0) {
        // Update existing account
        updatedAccounts = [...accounts];
        updatedAccounts[existingIndex] = account;
      } else {
        // Add new account
        updatedAccounts = [...accounts, account];
      }
      
      setAccounts(updatedAccounts);
      setSelectedAccount(account);
      
      await AsyncStorage.setItem('pezkuwi_accounts', JSON.stringify(updatedAccounts));
      
      console.log('✅ Account saved:', account.address);
    } catch (error) {
      console.error('Error saving account:', error);
      setError('Failed to save account');
    }
  };

  const value: PolkadotContextType = {
    accounts,
    selectedAccount,
    setSelectedAccount,
    saveAccount,
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
