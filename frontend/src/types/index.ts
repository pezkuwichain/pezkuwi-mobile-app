/**
 * PezkuwiChain Mobile App - Type Definitions
 */

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  trustScore: number;
  kycLevel: number;
  avatar?: string;
}

// Balance Types
export interface Balance {
  hez: string;
  pez: string;
  hezStaked: string;
  hezUsd: string;
  pezUsd: string;
  governancePower: string;
}

// Transaction Types
export enum TransactionType {
  SEND = 'send',
  RECEIVE = 'receive',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  REWARD = 'reward',
  GOVERNANCE = 'governance',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  token: 'HEZ' | 'PEZ';
  from: string;
  to: string;
  timestamp: number;
  blockNumber: number;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// Governance Types
export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  votingDeadline: number;
  yesVotes: string;
  noVotes: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
}

export interface Vote {
  proposalId: number;
  voter: string;
  vote: 'yes' | 'no';
  amount: string;
  conviction: number;
  timestamp: number;
}

// Parliamentary NFT Types
export interface ParliamentaryNFT {
  tokenId: number;
  owner: string;
  monthlySalary: string;
  electionDate: number;
  termEnd: number;
  status: 'active' | 'inactive';
}

// Identity Types
export interface DigitalIdentity {
  idNumber: string;
  name: string;
  photo: string;
  trustScore: number;
  kycLevel: number;
  verifications: {
    identity: boolean;
    education: boolean;
    kyc: boolean;
  };
  qrCode: string;
}

// Education Certificate Types
export interface Certificate {
  id: string;
  title: string;
  institution: string;
  issueDate: number;
  certificateType: 'bachelor' | 'master' | 'phd' | 'diploma' | 'certificate';
  verified: boolean;
  nftId?: number;
  qrCode: string;
}

// Referral Types
export interface Referral {
  code: string;
  totalReferrals: number;
  activeReferrals: number;
  rewardsEarned: string;
  referrals: ReferralUser[];
}

export interface ReferralUser {
  name: string;
  avatar: string;
  joinDate: number;
  reward: string;
  status: 'active' | 'inactive';
}

// Business Types
export interface MerchantDashboard {
  monthlyRevenue: string;
  transactions: number;
  customers: number;
  recentTransactions: MerchantTransaction[];
}

export interface MerchantTransaction {
  customerName: string;
  amount: string;
  token: 'HEZ' | 'PEZ';
  timestamp: number;
}

// Exchange Types
export interface ExchangeRate {
  from: 'HEZ' | 'PEZ';
  to: 'HEZ' | 'PEZ';
  rate: number;
  timestamp: number;
}

export interface SwapTransaction {
  fromToken: 'HEZ' | 'PEZ';
  toToken: 'HEZ' | 'PEZ';
  fromAmount: string;
  toAmount: string;
  rate: number;
  slippage: number;
  timestamp: number;
}

// Navigation Types
export type RootStackParamList = {
  LanguageSelection: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  Send: { token: 'HEZ' | 'PEZ' };
  Receive: { token: 'HEZ' | 'PEZ' };
  ProposalDetail: { proposalId: number };
  CertificateDetail: { certificateId: string };
  QRScanner: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Wallet: undefined;
  Governance: undefined;
  Referral: undefined;
  Profile: undefined;
};

// Blockchain Types
export interface ChainConfig {
  name: string;
  rpcUrl: string;
  chainId: string;
  genesisHash: string;
  decimals: {
    hez: number;
    pez: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

