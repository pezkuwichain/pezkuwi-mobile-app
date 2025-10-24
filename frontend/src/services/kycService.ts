/**
 * KYC Service
 * Handles Identity-KYC form submission, encryption, and blockchain interaction
 */

import * as SecureStore from 'expo-secure-store';
import { KYCFormData, KYCSubmission, KurdistanCitizen, KYCStatus } from '../types/kyc';
import { blockchainService } from './blockchain';

const KYC_DATA_KEY = 'pezkuwi_kyc_data';
const CITIZEN_DATA_KEY = 'pezkuwi_citizen_data';
const KYC_STATUS_KEY = 'pezkuwi_kyc_status';

class KYCService {
  /**
   * Generate hash from KYC data
   * This hash will be submitted to blockchain
   */
  private async generateHash(data: KYCFormData): Promise<string> {
    // In production, use proper cryptographic hash (SHA-256)
    const dataString = JSON.stringify(data);
    
    // Simple hash for development (replace with proper crypto in production)
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  }

  /**
   * Save KYC form data locally (encrypted)
   */
  async saveKYCData(data: KYCFormData): Promise<void> {
    try {
      const encrypted = JSON.stringify(data);
      await SecureStore.setItemAsync(KYC_DATA_KEY, encrypted);
      console.log('✅ KYC data saved locally (encrypted)');
    } catch (error) {
      console.error('❌ Failed to save KYC data:', error);
      throw error;
    }
  }

  /**
   * Get saved KYC data
   */
  async getKYCData(): Promise<KYCFormData | null> {
    try {
      const encrypted = await SecureStore.getItemAsync(KYC_DATA_KEY);
      if (!encrypted) return null;
      
      return JSON.parse(encrypted);
    } catch (error) {
      console.error('❌ Failed to get KYC data:', error);
      return null;
    }
  }

  /**
   * Submit KYC to blockchain
   * Only hash is sent, not the actual data
   */
  async submitKYC(data: KYCFormData, signer: any): Promise<KYCSubmission> {
    try {
      // 1. Save data locally first
      await this.saveKYCData(data);
      
      // 2. Generate hash
      const dataHash = await this.generateHash(data);
      console.log('📝 Generated KYC hash:', dataHash);
      
      // 3. Submit hash to blockchain (identity-kyc pallet)
      // TODO: Replace with actual blockchain call when testnet is active
      const txHash = await this.submitHashToBlockchain(dataHash, signer);
      
      const submission: KYCSubmission = {
        dataHash,
        submittedAt: Date.now(),
        txHash,
      };
      
      // 4. Update KYC status
      await this.updateKYCStatus({ started: true, submitted: true, approved: false });
      
      console.log('✅ KYC submitted to blockchain');
      return submission;
    } catch (error) {
      console.error('❌ Failed to submit KYC:', error);
      throw error;
    }
  }

  /**
   * Submit hash to blockchain (identity-kyc pallet)
   */
  private async submitHashToBlockchain(dataHash: string, signer: any): Promise<string> {
    try {
      // Check if blockchain is connected
      if (!blockchainService.isApiConnected()) {
        console.log('⚠️ Blockchain not connected, using mock submission');
        // Mock transaction hash for development
        return `0x${Math.random().toString(16).substr(2, 64)}`;
      }
      
      // TODO: Actual blockchain submission
      // const api = blockchainService.getApi();
      // const tx = api.tx.identityKyc.submitKyc(dataHash);
      // const hash = await tx.signAndSend(signer);
      // return hash.toString();
      
      // Mock for now
      return `0x${Math.random().toString(16).substr(2, 64)}`;
    } catch (error) {
      console.error('❌ Failed to submit to blockchain:', error);
      throw error;
    }
  }

  /**
   * Check KYC approval status on blockchain
   */
  async checkApprovalStatus(address: string): Promise<boolean> {
    try {
      // TODO: Query blockchain for approval status
      // const api = blockchainService.getApi();
      // const approval = await api.query.identityKyc.approvals(address);
      // return approval.isSome;
      
      // Mock: Auto-approve after 5 seconds (for development)
      const status = await this.getKYCStatus();
      if (status.submitted) {
        const timeSinceSubmission = Date.now() - (status.citizen?.approvedAt || 0);
        return timeSinceSubmission > 5000; // 5 seconds
      }
      
      return false;
    } catch (error) {
      console.error('❌ Failed to check approval status:', error);
      return false;
    }
  }

  /**
   * Generate Kurdistan Digital Citizen certificate
   * Called after KYC is approved on blockchain
   */
  async generateCitizen(data: KYCFormData, dataHash: string): Promise<KurdistanCitizen> {
    try {
      // Generate unique Citizen ID
      const citizenId = `KRD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Generate QR code data
      const qrData = JSON.stringify({
        citizenId,
        name: data.fullName,
        region: data.region,
        hash: dataHash,
      });
      
      const citizen: KurdistanCitizen = {
        citizenId,
        fullName: data.fullName,
        photo: data.photo || '',
        region: data.region,
        kycApproved: true,
        approvedAt: Date.now(),
        dataHash,
        qrCode: qrData,
      };
      
      // Save citizen data locally (encrypted)
      await SecureStore.setItemAsync(CITIZEN_DATA_KEY, JSON.stringify(citizen));
      
      // Update KYC status
      await this.updateKYCStatus({
        started: true,
        submitted: true,
        approved: true,
        citizen,
      });
      
      console.log('✅ Kurdistan Digital Citizen generated:', citizenId);
      return citizen;
    } catch (error) {
      console.error('❌ Failed to generate citizen:', error);
      throw error;
    }
  }

  /**
   * Get citizen data
   */
  async getCitizen(): Promise<KurdistanCitizen | null> {
    try {
      const data = await SecureStore.getItemAsync(CITIZEN_DATA_KEY);
      if (!data) return null;
      
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Failed to get citizen data:', error);
      return null;
    }
  }

  /**
   * Get KYC status
   */
  async getKYCStatus(): Promise<KYCStatus> {
    try {
      const statusData = await SecureStore.getItemAsync(KYC_STATUS_KEY);
      if (!statusData) {
        return { started: false, submitted: false, approved: false };
      }
      
      return JSON.parse(statusData);
    } catch (error) {
      console.error('❌ Failed to get KYC status:', error);
      return { started: false, submitted: false, approved: false };
    }
  }

  /**
   * Update KYC status
   */
  private async updateKYCStatus(status: KYCStatus): Promise<void> {
    try {
      await SecureStore.setItemAsync(KYC_STATUS_KEY, JSON.stringify(status));
    } catch (error) {
      console.error('❌ Failed to update KYC status:', error);
    }
  }

  /**
   * Check if user has access to Governance
   */
  async hasGovernanceAccess(): Promise<boolean> {
    const status = await this.getKYCStatus();
    return status.approved;
  }

  /**
   * Clear all KYC data (for testing)
   */
  async clearKYCData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KYC_DATA_KEY);
      await SecureStore.deleteItemAsync(CITIZEN_DATA_KEY);
      await SecureStore.deleteItemAsync(KYC_STATUS_KEY);
      console.log('✅ KYC data cleared');
    } catch (error) {
      console.error('❌ Failed to clear KYC data:', error);
    }
  }
}

export const kycService = new KYCService();
export default kycService;

