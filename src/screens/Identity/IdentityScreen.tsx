import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { kycService } from '../../services/kycService';
import { KYCStatus } from '../../types/kyc';

export default function IdentityScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<KYCStatus>({
    started: false,
    submitted: false,
    approved: false,
  });

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const status = await kycService.getKYCStatus();
      setKycStatus(status);
    } catch (error) {
      console.error('Failed to load KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </SafeAreaView>
    );
  }

  // If KYC approved, show citizen card access
  if (kycStatus.approved && kycStatus.citizen) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Digital Identity</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.approvedCard}>
            <Ionicons name="checkmark-circle" size={60} color={Colors.mint} />
            <Text style={styles.approvedTitle}>KYC Approved</Text>
            <Text style={styles.approvedSubtitle}>You are a verified Kurdistan Digital Citizen</Text>
          </View>

          <TouchableOpacity
            style={styles.viewCardButton}
            onPress={() => navigation.navigate('CitizenCard')}
          >
            <Ionicons name="card-outline" size={24} color="#FFFFFF" />
            <Text style={styles.viewCardButtonText}>View Citizen Card</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.teal} />
            <Text style={styles.infoText}>
              Your citizen card grants you access to Governance (Welati) and other citizen-only features.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // If KYC submitted but not approved
  if (kycStatus.submitted && !kycStatus.approved) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Digital Identity</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.pendingCard}>
            <Ionicons name="time-outline" size={60} color={Colors.gold} />
            <Text style={styles.pendingTitle}>KYC Under Review</Text>
            <Text style={styles.pendingSubtitle}>
              Your application is being reviewed. You will be notified once approved.
            </Text>
          </View>

          <TouchableOpacity style={styles.refreshButton} onPress={loadKYCStatus}>
            <Ionicons name="refresh-outline" size={20} color={Colors.teal} />
            <Text style={styles.refreshButtonText}>Check Status</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If KYC not started
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Identity</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeCard}>
          <Ionicons name="person-add-outline" size={60} color={Colors.teal} />
          <Text style={styles.welcomeTitle}>Become a Digital Citizen</Text>
          <Text style={styles.welcomeSubtitle}>
            Complete KYC verification to access Governance (Welati) and become a verified Kurdistan Digital Citizen.
          </Text>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Benefits:</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
            <Text style={styles.benefitText}>Vote on governance proposals</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
            <Text style={styles.benefitText}>Access Parliamentary NFT elections</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
            <Text style={styles.benefitText}>Digital citizenship certificate</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
            <Text style={styles.benefitText}>Verified trust score</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('IdentityKYCForm')}
        >
          <Text style={styles.startButtonText}>Start KYC Verification</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  welcomeCard: {
    backgroundColor: Colors.card,
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xlarge,
    alignItems: 'center',
    ...Shadow.soft,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: Spacing.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsCard: {
    backgroundColor: Colors.mint + '20',
    padding: Spacing.xl,
    borderRadius: BorderRadius.large,
    marginTop: Spacing.xl,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: Spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.textDark,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: Colors.teal,
    borderRadius: BorderRadius.xxlarge,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    ...Shadow.soft,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  approvedCard: {
    backgroundColor: Colors.mint + '20',
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xlarge,
    alignItems: 'center',
    ...Shadow.soft,
  },
  approvedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.mint,
    marginTop: Spacing.lg,
  },
  approvedSubtitle: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  viewCardButton: {
    flexDirection: 'row',
    backgroundColor: Colors.teal,
    borderRadius: BorderRadius.xxlarge,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    ...Shadow.soft,
  },
  viewCardButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.teal + '20',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
  },
  pendingCard: {
    backgroundColor: Colors.gold + '20',
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xlarge,
    alignItems: 'center',
    ...Shadow.soft,
  },
  pendingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gold,
    marginTop: Spacing.lg,
  },
  pendingSubtitle: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.teal,
  },
});

