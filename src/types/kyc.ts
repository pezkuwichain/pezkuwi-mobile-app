/**
 * Identity KYC Types
 */

export type Region = 'basur' | 'bakur' | 'rojava' | 'rojhelat' | 'kurdistan_a_sor' | 'diaspora';

export type MaritalStatus = 'single' | 'married';

export interface Child {
  name: string;
  order: number; // 1st child, 2nd child, etc.
}

export interface KYCFormData {
  // Personal Information
  fullName: string;
  fatherName: string;
  grandfatherName: string;
  greatGrandfatherName: string;
  motherName: string;
  
  // Marital Status
  maritalStatus: MaritalStatus;
  spouseName?: string;
  numberOfChildren?: number;
  children?: Child[];
  
  // Region
  region: Region;
  
  // Photo (base64 or file URI)
  photo?: string;
}

export interface KYCSubmission {
  // Hash of the KYC data (sent to blockchain)
  dataHash: string;
  
  // Timestamp
  submittedAt: number;
  
  // Blockchain transaction hash
  txHash?: string;
}

export interface KurdistanCitizen {
  // Citizen ID (generated after KYC approval)
  citizenId: string;
  
  // Personal Info (stored locally, encrypted)
  fullName: string;
  photo: string;
  region: Region;
  
  // KYC Status
  kycApproved: boolean;
  approvedAt: number;
  
  // Blockchain reference (only hash)
  dataHash: string;
  
  // QR Code for verification
  qrCode: string;
}

export interface KYCStatus {
  // Has user started KYC?
  started: boolean;
  
  // Has user submitted KYC?
  submitted: boolean;
  
  // Is KYC approved on blockchain?
  approved: boolean;
  
  // Citizen data (only if approved)
  citizen?: KurdistanCitizen;
}

// Region labels for UI
export const REGION_LABELS: Record<Region, { en: string; ku: string }> = {
  basur: { en: 'Başur (South Kurdistan)', ku: 'باشوور (کوردستانی باشوور)' },
  bakur: { en: 'Bakur (North Kurdistan)', ku: 'باکوور (کوردستانی باکوور)' },
  rojava: { en: 'Rojava (West Kurdistan)', ku: 'رۆژاڤا (کوردستانی رۆژاڤا)' },
  rojhelat: { en: 'Rojhelat (East Kurdistan)', ku: 'رۆژهەڵات (کوردستانی رۆژهەڵات)' },
  kurdistan_a_sor: { en: 'Kurdistan a Sor (Red Kurdistan)', ku: 'کوردستانا سور' },
  diaspora: { en: 'Diaspora', ku: 'دیاسپۆرا' },
};

