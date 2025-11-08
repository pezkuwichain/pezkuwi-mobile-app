// ========================================
// Citizenship Type Definitions
// ========================================

export type KycStatus = 'NotStarted' | 'Pending' | 'Approved' | 'Rejected';

export type Region =
  | 'bakur'       // North (Turkey)
  | 'basur'       // South (Iraq)
  | 'rojava'      // West (Syria)
  | 'rojhelat'    // East (Iran)
  | 'diaspora'    // Diaspora
  | 'kurdistan_a_sor'; // Red Kurdistan (Armenia/Azerbaijan)

export type MaritalStatus = 'zewici' | 'nezewici'; // Married / Unmarried

export interface ChildInfo {
  name: string;
  birthYear: number;
}

export interface CitizenshipData {
  // Personal Identity
  fullName: string;
  fatherName: string;
  grandfatherName: string;
  motherName: string;

  // Tribal Affiliation
  tribe: string;

  // Family Status
  maritalStatus: MaritalStatus;
  childrenCount?: number;
  children?: ChildInfo[];

  // Geographic Origin
  region: Region;

  // Contact & Profession
  email: string;
  profession: string;

  // Referral
  referralCode?: string;

  // Metadata
  walletAddress: string;
  timestamp: number;
}

export interface CitizenshipCommitment {
  commitmentHash: string;    // SHA256 hash of all data
  nullifierHash: string;      // Prevents double-registration
  ipfsCid: string;            // IPFS CID of encrypted data
  publicKey: string;          // User's encryption public key
  timestamp: number;
}

export interface TikiInfo {
  id: string;
  role: string;
  metadata?: any;
}

export interface CitizenshipStatus {
  kycStatus: KycStatus;
  hasCitizenTiki: boolean;
  tikiNumber?: string;
  stakingScoreTracking: boolean;
  ipfsCid?: string;
  nextAction: 'APPLY_KYC' | 'CLAIM_TIKI' | 'START_TRACKING' | 'COMPLETE';
}

// Region Display Names
export const REGION_NAMES: Record<Region, { en: string; ku: string; tr: string }> = {
  bakur: {
    en: 'Bakur (North Kurdistan)',
    ku: 'Bakur (Kurdistana Bakur)',
    tr: 'Bakur (Kuzey Kürdistan)',
  },
  basur: {
    en: 'Basur (South Kurdistan)',
    ku: 'Basur (Kurdistana Başûr)',
    tr: 'Basur (Güney Kürdistan)',
  },
  rojava: {
    en: 'Rojava (West Kurdistan)',
    ku: 'Rojava (Kurdistana Rojava)',
    tr: 'Rojava (Batı Kürdistan)',
  },
  rojhelat: {
    en: 'Rojhelat (East Kurdistan)',
    ku: 'Rojhelat (Kurdistana Rojhilat)',
    tr: 'Rojhelat (Doğu Kürdistan)',
  },
  diaspora: {
    en: 'Diaspora',
    ku: 'Diyaspora',
    tr: 'Diaspora',
  },
  kurdistan_a_sor: {
    en: 'Red Kurdistan',
    ku: 'Kurdistana Sor',
    tr: 'Kızıl Kürdistan',
  },
};

// Tiki Roles (from pallet-tiki)
export const TIKI_ROLES = [
  'Hemwelatî',          // 0: Citizen
  'Parlementer',        // 1: Parliament Member
  'SerokiMeclise',      // 2: Parliament Speaker
  'Serok',              // 3: President
  'Wezir',              // 4: Minister
  'EndameDiwane',       // 5: Council Member
  'Dadger',             // 6: Judge
  'Dozger',             // 7: Prosecutor
  'Hiquqnas',           // 8: Lawyer
  'Noter',              // 9: Notary
  'Xezinedar',          // 10: Treasurer
  'Bacgir',             // 11: Tax Collector
  'GerinendeyeCavkaniye', // 12: Resource Manager
  'OperatorêTorê',      // 13: Network Operator
  'PisporêEwlehiyaSîber', // 14: Cybersecurity Expert
  'GerinendeyeDaneye',  // 15: Data Manager
  'Berdevk',            // 16: Spokesperson
  'Qeydkar',            // 17: Registrar
  'Balyoz',             // 18: Ambassador
  'Navbeynkar',         // 19: Mediator
  'ParêzvaneÇandî',     // 20: Cultural Protector
  'Mufetîs',            // 21: Inspector
  'KalîteKontrolker',   // 22: Quality Controller
  'Mela',               // 23: Mullah
  'Feqî',               // 24: Scholar
  'Perwerdekar',        // 25: Educator
  'Rewsenbîr',          // 26: Intellectual
  'RêveberêProjeyê',    // 27: Project Manager
  'SerokêKomele',       // 28: Community Leader
  'ModeratorêCivakê',   // 29: Community Moderator
  'Axa',                // 30: Landlord
  'Pêseng',             // 31: Pioneer
  'Sêwirmend',          // 32: Advisor
  'Hekem',              // 33: Wise
  'Mamoste',            // 34: Teacher
  'Bazargan',           // 35: Merchant
  'SerokWeziran',       // 36: Prime Minister
  'WezireDarayiye',     // 37: Finance Minister
  'WezireParez',        // 38: Defense Minister
  'WezireDad',          // 39: Justice Minister
  'WezireBelaw',        // 40: Education Minister
  'WezireTend',         // 41: Health Minister
  'WezireAva',          // 42: Infrastructure Minister
  'WezireCand',         // 43: Culture Minister
];
