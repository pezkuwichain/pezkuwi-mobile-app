import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: number;
  pendingRewards: number;
}

interface Referral {
  id: string;
  name: string;
  joinDate: string;
  status: 'active' | 'pending' | 'inactive';
  rewardEarned: number;
  tier: number;
}

export default function ReferralScreen() {
  const [referralCode] = useState('PKW-2024-KURD-5X7Y');
  const [stats] = useState<ReferralStats>({
    totalReferrals: 12,
    activeReferrals: 8,
    totalRewards: 2450,
    pendingRewards: 350,
  });

  const [referrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'Ahmed Karwan',
      joinDate: '2024-01-15',
      status: 'active',
      rewardEarned: 500,
      tier: 1,
    },
    {
      id: '2',
      name: 'Layla Sherzad',
      joinDate: '2024-01-20',
      status: 'active',
      rewardEarned: 500,
      tier: 1,
    },
    {
      id: '3',
      name: 'Saman Aziz',
      joinDate: '2024-02-05',
      status: 'active',
      rewardEarned: 250,
      tier: 2,
      },
    {
      id: '4',
      name: 'Hana Dilshad',
      joinDate: '2024-02-18',
      status: 'pending',
      rewardEarned: 0,
      tier: 1,
    },
  ]);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert('✓ Copied!', 'Referral code copied to clipboard');
  };

  const shareReferralCode = async () => {
    try {
      await Share.share({
        message: `Join PezkuwiChain - Digital Kurdistan's Blockchain Platform!\n\nUse my referral code: ${referralCode}\n\nEarn rewards and be part of building Digital Kurdistan! 🦅`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'inactive':
        return Colors.textGray;
      default:
        return Colors.textGray;
    }
  };

  const getTierReward = (tier: number) => {
    switch (tier) {
      case 1:
        return '500 PEZ';
      case 2:
        return '250 PEZ';
      case 3:
        return '100 PEZ';
      default:
        return '50 PEZ';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Referral Program</Text>
          <Text style={styles.headerSubtitle}>
            Invite friends and earn rewards together
          </Text>
        </View>

        {/* Referral Code Card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <View style={styles.qrContainer}>
            <QRCode value={referralCode} size={120} />
          </View>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={copyToClipboard}
            >
              <Ionicons name="copy-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={shareReferralCode}
            >
              <Ionicons name="share-social-outline" size={20} color="white" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={28} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={28}
              color={Colors.success}
            />
            <Text style={styles.statValue}>{stats.activeReferrals}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={28} color={Colors.kurdishGold} />
            <Text style={styles.statValue}>{stats.totalRewards}</Text>
            <Text style={styles.statLabel}>Total Rewards (PEZ)</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={28} color={Colors.warning} />
            <Text style={styles.statValue}>{stats.pendingRewards}</Text>
            <Text style={styles.statLabel}>Pending (PEZ)</Text>
          </View>
        </View>

        {/* Reward Tiers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reward Tiers</Text>
          <View style={styles.tierCard}>
            <View style={styles.tierRow}>
              <View style={styles.tierBadge}>
                <Text style={styles.tierBadgeText}>Tier 1</Text>
              </View>
              <Text style={styles.tierDescription}>Direct Referrals</Text>
              <Text style={styles.tierReward}>500 PEZ</Text>
            </View>
            <View style={styles.tierRow}>
              <View style={[styles.tierBadge, { backgroundColor: Colors.success }]}>
                <Text style={styles.tierBadgeText}>Tier 2</Text>
              </View>
              <Text style={styles.tierDescription}>2nd Level Referrals</Text>
              <Text style={styles.tierReward}>250 PEZ</Text>
            </View>
            <View style={styles.tierRow}>
              <View style={[styles.tierBadge, { backgroundColor: Colors.kurdishGold }]}>
                <Text style={styles.tierBadgeText}>Tier 3</Text>
              </View>
              <Text style={styles.tierDescription}>3rd Level Referrals</Text>
              <Text style={styles.tierReward}>100 PEZ</Text>
            </View>
          </View>
        </View>

        {/* Referral List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Referrals</Text>
          {referrals.map((referral) => (
            <View key={referral.id} style={styles.referralCard}>
              <View style={styles.referralHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {referral.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.referralInfo}>
                  <Text style={styles.referralName}>{referral.name}</Text>
                  <Text style={styles.referralDate}>
                    Joined: {referral.joinDate}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(referral.status) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(referral.status) },
                    ]}
                  >
                    {referral.status.charAt(0).toUpperCase() +
                      referral.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.referralFooter}>
                <View style={styles.tierInfo}>
                  <Ionicons
                    name="ribbon-outline"
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={styles.tierText}>Tier {referral.tier}</Text>
                </View>
                <Text style={styles.rewardText}>
                  Earned: {referral.rewardEarned} PEZ
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.infoText}>
                Share your unique referral code with friends
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.infoText}>
                They sign up and complete KYC verification
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.infoText}>
                Both of you earn PEZ rewards based on tier level
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.infoText}>
                Rewards are distributed automatically to your wallet
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textGray,
  },
  codeCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 20,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 20,
  },
  codeBox: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.background,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  shareButton: {
    backgroundColor: Colors.primary,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textGray,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 12,
  },
  tierCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tierBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  tierDescription: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
  },
  tierReward: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.kurdishGold,
  },
  referralCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  referralDate: {
    fontSize: 13,
    color: Colors.textGray,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  referralFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  tierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
    paddingTop: 4,
  },
});

