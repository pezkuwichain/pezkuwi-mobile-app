// ========================================
// PezkuwiChain - Mobile Wallet Configuration
// ========================================
// React Native compatible wallet configuration

import Constants from 'expo-constants';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// ========================================
// NETWORK ENDPOINTS
// ========================================
export const NETWORK_ENDPOINTS = {
  local: 'ws://127.0.0.1:9944',
  testnet: 'wss://testnet.pezkuwichain.io',
  beta: 'wss://beta.pezkuwichain.io',
  mainnet: 'wss://mainnet.pezkuwichain.io',
  staging: 'wss://staging.pezkuwichain.io',
};

// ========================================
// CHAIN CONFIGURATION
// ========================================
export const CHAIN_CONFIG = {
  name: 'PezkuwiChain',
  symbol: 'PEZ',
  decimals: 12,
  ss58Format: 42,
};

// ========================================
// SUBSTRATE ASSET IDs (Assets Pallet)
// ========================================
// ⚠️ IMPORTANT: HEZ is the native token and does NOT have an Asset ID
// Only wrapped/asset tokens are listed here
export const ASSET_IDS = {
  WHEZ: 0,   // Wrapped HEZ
  PEZ: 1,    // PEZ utility token
  WUSDT: 2,  // Wrapped USDT (multisig backed)
  USDT: 3,
  BTC: 4,
  ETH: 5,
  DOT: 6,
} as const;

// ========================================
// EXPLORER URLS
// ========================================
export const EXPLORER_URLS = {
  polkadotJs: 'https://polkadot.js.org/apps/?rpc=',
  custom: 'https://explorer.pezkuwichain.io',
};

// ========================================
// WALLET ERROR MESSAGES
// ========================================
export const WALLET_ERRORS = {
  NO_EXTENSION: 'No wallet detected. Please create or import a wallet.',
  NO_ACCOUNTS: 'No accounts found. Please create an account first.',
  CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please check your balance and try again.',
  USER_REJECTED: 'User rejected the request.',
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete transaction.',
  INVALID_ADDRESS: 'Invalid address format.',
  API_NOT_READY: 'Blockchain API not ready. Please wait...',
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Format Substrate address for display (SS58 format)
 * @param address - Full substrate address
 * @returns Shortened address string (e.g., "5GrwV...xQjz")
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format balance from planck to human-readable format
 * @param balance - Balance in smallest unit (planck)
 * @param decimals - Token decimals (default 12 for PEZ)
 * @returns Formatted balance string
 */
export const formatBalance = (balance: string | number, decimals = 12): string => {
  if (!balance) return '0';
  const value = typeof balance === 'string' ? parseFloat(balance) : balance;
  const formatted = (value / Math.pow(10, decimals)).toFixed(4);
  
  // Remove trailing zeros
  return parseFloat(formatted).toString();
};

/**
 * Parse human-readable amount to planck (smallest unit)
 * @param amount - Human-readable amount
 * @param decimals - Token decimals
 * @returns Amount in planck
 */
export const parseAmount = (amount: string | number, decimals = 12): bigint => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return BigInt(Math.floor(value * Math.pow(10, decimals)));
};

/**
 * Get asset symbol by ID
 * @param assetId - Asset ID from Assets pallet
 * @returns Asset symbol or 'UNKNOWN'
 */
export const getAssetSymbol = (assetId: number): string => {
  const entry = Object.entries(ASSET_IDS).find(([_, id]) => id === assetId);
  return entry ? entry[0] : 'UNKNOWN';
};

/**
 * Get current network endpoint
 * Defaults to beta network for testing
 * @returns WebSocket endpoint URL
 */
export const getCurrentEndpoint = (): string => {
  // For mobile, we default to beta network
  return NETWORK_ENDPOINTS.beta;
};

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface PolkadotWalletState {
  isConnected: boolean;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  balance: string;
  error: string | null;
}

export const initialPolkadotWalletState: PolkadotWalletState = {
  isConnected: false,
  accounts: [],
  selectedAccount: null,
  balance: '0',
  error: null,
};

// ========================================
// FOUNDER ADDRESS
// ========================================
export const FOUNDER_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Satoshi Qazi Muhammed
