import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';

interface RewardStats {
  totalEarned: number;
  pendingRewards: number;
  claimableRewards: number;
  nextRewardDate: string;
}

interface RewardHistory {
  id: string;
  type: 'validation' | 'referral' | 'governance' | 'staking';
  amount: number;
  date: string;
  status: 'claimed' | 'pending' | 'locked';
  unlockDate?: string;
}

export default function RewardsScreen({ navigation }: any) {
  const [stats] = useState<RewardStats>({
    totalEarned: 15750,
    pendingRewards: 850,
    claimableRewards: 450,
    nextRewardDate: '2024-01-25',
  });

  const [rewardHistory] = useState<RewardHistory[]>([
    {
      id: '1',
      type: 'validation',
      amount: 500,
      date: '2024-01-23',
      status: 'claimable',
    },
    {
      id: '2',
      type: 'referral',
      amount: 250,
      date: '2024-01-22',
      status: 'claimed',
    },
    {
      id: '3',
      type: 'governance',
      amount: 100,
      date: '2024-01-21',
      status: 'pending',
      unlockDate: '2024-01-25',
    },
    {
      id: '4',
      type: 'staking',
      amount: 750,
      date: '2024-01-20',
      status: 'claimed',
    },
  ]);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'validation':
        return 'shield-checkmark';
      case 'referral':
        return 'people';
      case 'governance':
        return 'vote';
      case 'staking':
        return 'lock-closed';
      default:
        return 'star';
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'validation':
        return Colors.success;
      case 'referral':
        return Colors.primary;
      case 'governance':
        return Colors.kurdishGold;
      case 'staking':
        return Colors.coral;
      default:
        return Colors.textGray;
    }
  };

  const getRewardLabel = (type: string) => {
    switch (type) {
      case 'validation':
        return 'Validation Reward';
      case 'referral':
        return 'Referral Reward';
      case 'governance':
        return 'Governance Reward';
      case 'staking':
        return 'Staking Reward';
      default:
        return 'Reward';
    }
  };

  const claimRewards = () => {
    if (stats.claimableRewards > 0) {
      Alert.alert(
        'Claim Rewards',
        `Claim ${stats.claimableRewards} PEZ rewards?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Claim',
            onPress: () => {
              Alert.alert(
                'Success!',
                `${stats.claimableRewards} PEZ claimed successfully!`
              );
            },
          },
        ]
      );
    } else {
      Alert.alert('No Claimable Rewards', 'You have no rewards to claim at this time.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.kurdishGold, Colors.coral]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Rewards</Text>
              <Text style={styles.headerSubtitle}>PEZ Rewards from pallet-pez-rewards</Text>
            </View>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() =>
                Alert.alert(
                  'Reward System',
                  'Earn PEZ rewards through validation, referrals, governance participation, and staking. Rewards are distributed automatically by pallet-pez-rewards.'
                )
              }
            >
              <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={28} color={Colors.kurdishGold} />
              <Text style={styles.statValue}>{stats.totalEarned.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Earned (PEZ)</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={28} color={Colors.warning} />
              <Text style={styles.statValue}>{stats.pendingRewards.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="gift" size={28} color={Colors.success} />
              <Text style={styles.statValue}>{stats.claimableRewards.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Claimable</Text>
            </View>
          </View>
        </View>

        {/* Claim Button */}
        {stats.claimableRewards > 0 && (
          <View style={styles.claimSection}>
            <TouchableOpacity
              style={styles.claimButton}
              onPress={claimRewards}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.success, Colors.primary]}
                style={styles.claimButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="download" size={20} color="white" />
                <Text style={styles.claimButtonText}>
                  Claim {stats.claimableRewards} PEZ
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Reward Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reward Sources</Text>
          <View style={styles.sourcesGrid}>
            <View style={styles.sourceCard}>
              <View style={[styles.sourceIcon, { backgroundColor: Colors.success + '20' }]}>
                <Ionicons name="shield-checkmark" size={32} color={Colors.success} />
              </View>
              <Text style={styles.sourceLabel}>Validation</Text>
              <Text style={styles.sourceDescription}>Earn by validating blocks</Text>
            </View>
            <View style={styles.sourceCard}>
              <View style={[styles.sourceIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="people" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.sourceLabel}>Referrals</Text>
              <Text style={styles.sourceDescription}>Invite friends to earn</Text>
            </View>
            <View style={styles.sourceCard}>
              <View style={[styles.sourceIcon, { backgroundColor: Colors.kurdishGold + '20' }]}>
                <Ionicons name="vote" size={32} color={Colors.kurdishGold} />
              </View>
              <Text style={styles.sourceLabel}>Governance</Text>
              <Text style={styles.sourceDescription}>Participate in voting</Text>
            </View>
            <View style={styles.sourceCard}>
              <View style={[styles.sourceIcon, { backgroundColor: Colors.coral + '20' }]}>
                <Ionicons name="lock-closed" size={32} color={Colors.coral} />
              </View>
              <Text style={styles.sourceLabel}>Staking</Text>
              <Text style={styles.sourceDescription}>Stake HEZ tokens</Text>
            </View>
          </View>
        </View>

        {/* Reward History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reward History</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {rewardHistory.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardHeader}>
                <View
                  style={[
                    styles.rewardIcon,
                    { backgroundColor: getRewardColor(reward.type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getRewardIcon(reward.type)}
                    size={24}
                    color={getRewardColor(reward.type)}
                  />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardType}>{getRewardLabel(reward.type)}</Text>
                  <Text style={styles.rewardDate}>{reward.date}</Text>
                  {reward.unlockDate && (
                    <Text style={styles.rewardUnlock}>
                      Unlocks: {reward.unlockDate}
                    </Text>
                  )}
                </View>
                <View style={styles.rewardAmount}>
                  <Text style={styles.amountValue}>+{reward.amount}</Text>
                  <Text style={styles.amountToken}>PEZ</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      reward.status === 'claimed'
                        ? Colors.success + '20'
                        : reward.status === 'pending'
                        ? Colors.warning + '20'
                        : Colors.primary + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        reward.status === 'claimed'
                          ? Colors.success
                          : reward.status === 'pending'
                          ? Colors.warning
                          : Colors.primary,
                    },
                  ]}
                >
                  {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>About Rewards</Text>
              <Text style={styles.infoText}>
                Rewards are distributed automatically by pallet-pez-rewards based on your
                participation in network validation, referrals, governance, and staking.
                Claim your rewards anytime to add them to your wallet balance.
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
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textGray,
    textAlign: 'center',
  },
  claimSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  claimButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  claimButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sourceCard: {
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
  sourceIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sourceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  sourceDescription: {
    fontSize: 12,
    color: Colors.textGray,
    textAlign: 'center',
  },
  rewardCard: {
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
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  rewardDate: {
    fontSize: 12,
    color: Colors.textGray,
  },
  rewardUnlock: {
    fontSize: 11,
    color: Colors.warning,
    marginTop: 2,
  },
  rewardAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.success,
  },
  amountToken: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '10',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textDark,
    lineHeight: 20,
  },
});

