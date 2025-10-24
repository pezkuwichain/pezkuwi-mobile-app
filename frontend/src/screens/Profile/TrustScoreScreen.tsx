import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';

interface TrustActivity {
  id: string;
  type: 'vote' | 'proposal' | 'stake' | 'community';
  description: string;
  points: number;
  timestamp: number;
}

export default function TrustScoreScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [trustScore] = useState(750);
  const [activities, setActivities] = useState<TrustActivity[]>([]);

  useEffect(() => {
    loadTrustData();
  }, []);

  const loadTrustData = async () => {
    // Mock data - replace with blockchain data
    setTimeout(() => {
      setActivities([
        {
          id: '1',
          type: 'vote',
          description: 'Voted on Proposal #42',
          points: 10,
          timestamp: Date.now() - 86400000,
        },
        {
          id: '2',
          type: 'stake',
          description: 'Staked 10,000 HEZ',
          points: 50,
          timestamp: Date.now() - 172800000,
        },
        {
          id: '3',
          type: 'proposal',
          description: 'Created Proposal #45',
          points: 25,
          timestamp: Date.now() - 259200000,
        },
        {
          id: '4',
          type: 'community',
          description: 'Referred 3 new citizens',
          points: 30,
          timestamp: Date.now() - 345600000,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return 'checkmark-circle';
      case 'proposal':
        return 'bulb';
      case 'stake':
        return 'lock-closed';
      case 'community':
        return 'people';
      default:
        return 'star';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'vote':
        return Colors.mint;
      case 'proposal':
        return Colors.peach;
      case 'stake':
        return Colors.blue;
      case 'community':
        return Colors.lavender;
      default:
        return Colors.teal;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trust Score</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trust Score Card */}
        <LinearGradient
          colors={[Colors.gold, '#E8C896']}
          style={styles.scoreCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="star" size={60} color="#FFFFFF" />
          <Text style={styles.scoreValue}>{trustScore}</Text>
          <Text style={styles.scoreLabel}>Your Trust Score</Text>
          
          <View style={styles.scoreBadge}>
            <Text style={styles.badgeText}>🏆 Gold Tier</Text>
          </View>
        </LinearGradient>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          
          <View style={styles.benefitCard}>
            <Ionicons name="trending-up" size={24} color={Colors.mint} />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Higher PEZ Rewards</Text>
              <Text style={styles.benefitDescription}>
                Earn 1.5x more PEZ rewards from staking
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.blue} />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Validator Priority</Text>
              <Text style={styles.benefitDescription}>
                Higher chance of being selected as validator
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <Ionicons name="megaphone" size={24} color={Colors.peach} />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Governance Weight</Text>
              <Text style={styles.benefitDescription}>
                Your votes carry more weight in proposals
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={Colors.teal} />
          ) : (
            activities.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: getActivityColor(activity.type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getActivityIcon(activity.type)}
                    size={24}
                    color={getActivityColor(activity.type)}
                  />
                </View>

                <View style={styles.activityInfo}>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityDate}>{formatDate(activity.timestamp)}</Text>
                </View>

                <View style={styles.activityPoints}>
                  <Text style={styles.pointsValue}>+{activity.points}</Text>
                  <Text style={styles.pointsLabel}>points</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* How to Increase */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Increase Trust Score</Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>✓ Vote on governance proposals</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>✓ Stake HEZ tokens</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>✓ Create valuable proposals</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>✓ Refer new citizens</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>✓ Maintain long-term participation</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  scoreCard: {
    borderRadius: BorderRadius.xlarge,
    padding: Spacing.xxxl,
    alignItems: 'center',
    ...Shadow.large,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: Spacing.md,
  },
  scoreLabel: {
    fontSize: Typography.sizes.medium,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scoreBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xxlarge,
    marginTop: Spacing.lg,
  },
  badgeText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  section: {
    marginTop: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginBottom: Spacing.lg,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.md,
    ...Shadow.small,
  },
  benefitText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  benefitTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadow.small,
  },
  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  activityDescription: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    color: Colors.textDark,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
  },
  activityPoints: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.mint,
  },
  pointsLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
  },
  tipCard: {
    backgroundColor: Colors.mint + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textDark,
  },
});

