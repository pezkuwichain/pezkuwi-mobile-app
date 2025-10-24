/**
 * PezkuwiChain Blockchain Configuration
 */

import { ChainConfig } from '../types';

export const CHAIN_CONFIGS: Record<'testnet' | 'mainnet', ChainConfig> = {
  testnet: {
    name: 'PezkuwiChain Testnet',
    rpcUrl: 'wss://testnet-rpc.pezkuwichain.io',
    chainId: 'pezkuwi-testnet',
    genesisHash: '0x0000000000000000000000000000000000000000000000000000000000000000', // Will be updated
    decimals: {
      hez: 12,
      pez: 12,
    },
  },
  mainnet: {
    name: 'PezkuwiChain Mainnet',
    rpcUrl: 'wss://mainnet-rpc.pezkuwichain.io',
    chainId: 'pezkuwi-mainnet',
    genesisHash: '0x0000000000000000000000000000000000000000000000000000000000000000', // Will be updated
    decimals: {
      hez: 12,
      pez: 12,
    },
  },
};

// Default to testnet for development
export const DEFAULT_CHAIN: 'testnet' | 'mainnet' = 'testnet';

export const CURRENT_CHAIN_CONFIG = CHAIN_CONFIGS[DEFAULT_CHAIN];

// Pallet names
export const PALLETS = {
  BALANCES: 'balances',
  ASSETS: 'assets',
  STAKING: 'staking',
  WELATI: 'welati',
  TRUST: 'trust',
  PEZ_REWARDS: 'pezRewards',
  PEZ_TREASURY: 'pezTreasury',
  IDENTITY_KYC: 'identityKyc',
  PERWERDE: 'perwerde',
  REFERRAL: 'referral',
  VALIDATOR_POOL: 'validatorPool',
  STAKING_SCORE: 'stakingScore',
};

// Asset IDs
export const ASSET_IDS = {
  PEZ: 1, // PEZ token asset ID
};

// Constants from blockchain
export const BLOCKCHAIN_CONSTANTS = {
  // PEZ Token
  PEZ_TOTAL_SUPPLY: '5000000000000000000000', // 5 billion with 12 decimals
  PEZ_HALVING_PERIOD: 48, // months
  PEZ_EPOCH_BLOCKS: 432000, // ~30 days
  PEZ_CLAIM_PERIOD: 100800, // ~1 week
  
  // Parliamentary NFT
  PARLIAMENTARY_NFT_COUNT: 201,
  PARLIAMENTARY_NFT_COLLECTION_ID: 100,
  PARLIAMENTARY_NFT_INCENTIVE_PERCENT: 10, // 10% of rewards pool
  
  // Trust Score
  TRUST_SCORE_MIN: 0,
  TRUST_SCORE_MAX: 1000,
  
  // Staking
  MIN_STAKE_AMOUNT: '1000000000000', // 1 HEZ with 12 decimals
  UNBONDING_PERIOD: 28, // days
  
  // Governance
  PROPOSAL_DEPOSIT: '100000000000000', // 100 PEZ with 12 decimals
  VOTING_PERIOD: 7, // days
};

// Block time (approximate)
export const BLOCK_TIME = 6; // seconds

// Transaction fees (approximate)
export const TX_FEES = {
  TRANSFER: '0.01', // HEZ
  STAKE: '0.02',
  VOTE: '0.01',
  PROPOSAL: '0.05',
};

