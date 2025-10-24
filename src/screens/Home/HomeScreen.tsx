import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow, IconSizes } from '../../constants/theme';
import { blockchainService } from '../../services/blockchain';
import { Balance } from '../../types';

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export default function HomeScreen({ navigation }: any) {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [trustScore] = useState(750);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      // Try to connect to blockchain
      const connected = await blockchainService.connect();
      if (connected) {
        const bal = await blockchainService.getBalances(
          '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        );
        setBalance(bal);
      }
    } catch (error) {
      console.log('Using mock data');
      // Use mock data
      setBalance({
        hez: '45,750.5',
        pez: '1,234,567',
        hezStaked: '30,000',
        hezUsd: '45,234',
        pezUsd: '123,456',
        governancePower: '2.5',
      });
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'send',
      label: 'Send',
      icon: 'arrow-forward',
      color: Colors.coral,
      onPress: () => navigation.navigate('Send', { token: 'HEZ' }),
    },
    {
      id: 'receive',
      label: 'Receive',
      icon: 'arrow-down',
      color: Colors.blue,
      onPress: () => navigation.navigate('Receive', { token: 'HEZ' }),
    },
    {
      id: 'vote',
      label: 'Vote',
      icon: 'checkmark-circle',
      color: Colors.mint,
      onPress: () => navigation.navigate('Governance'),
    },
    {
      id: 'proposals',
      label: 'Proposals',
      icon: 'bulb',
      color: Colors.peach,
      onPress: () => navigation.navigate('Governance'),
    },
    {
      id: 'identity',
      label: 'Identity',
      icon: 'person',
      color: Colors.teal,
      onPress: () => navigation.navigate('Identity'),
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: 'school',
      color: Colors.gold,
      onPress: () => navigation.navigate('Education'),
    },
    {
      id: 'exchange',
      label: 'Exchange',
      icon: 'swap-horizontal',
      color: Colors.cyan,
      onPress: () => navigation.navigate('Exchange'),
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: 'star',
      color: Colors.lavender,
      onPress: () => navigation.navigate('Wallet'),
    },
    {
      id: 'trust',
      label: 'Trust',
      icon: 'heart',
      color: Colors.emerald,
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={Colors.gradients.header}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerTop}>
            {/* Profile Avatar */}
            <TouchableOpacity 
              style={styles.profileSection}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>
              
              {/* Trust Score Badge */}
              <TouchableOpacity 
                style={styles.trustBadge}
                onPress={() => navigation.navigate('TrustScore')}
                activeOpacity={0.7}
              >
                <Ionicons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.trustScore}>{trustScore}</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Action Icons */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.navigate('QRScanner')}
              >
                <Ionicons name="qr-code-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.headerIcon}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => navigation.navigate('Profile')}
              >
                <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Balance Card */}
        <View style={styles.balanceCardContainer}>
          <TouchableOpacity 
            style={styles.balanceCard}
            onPress={() => navigation.navigate('Wallet')}
            activeOpacity={0.8}
          >
            <View style={styles.balanceRow}>
              <TouchableOpacity 
                style={styles.balanceItem}
                onPress={() => navigation.navigate('Wallet', { tab: 'HEZ' })}
                activeOpacity={0.7}
              >
                <Text style={styles.balanceLabel}>HEZ Balance</Text>
                <Text style={styles.balanceAmount}>{balance?.hez || '0'}</Text>
                <View style={styles.underline} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.balanceItem}
                onPress={() => navigation.navigate('Wallet', { tab: 'PEZ' })}
                activeOpacity={0.7}
              >
                <Text style={styles.balanceLabel}>PEZ Balance</Text>
                <Text style={styles.balanceAmountSecondary}>{balance?.pez || '0'}</Text>
                <View style={[styles.underline, { backgroundColor: Colors.peach }]} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionButton}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl * 2,
    borderBottomLeftRadius: BorderRadius.xxlarge,
    borderBottomRightRadius: BorderRadius.xxlarge,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    gap: Spacing.xs,
  },
  trustScore: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCardContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.xxxl,
  },
  balanceCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: BorderRadius.large,
    padding: Spacing.xl,
    ...Shadow.soft,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: Typography.sizes.body,
    color: Colors.textGray,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.bold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  balanceAmountSecondary: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  underline: {
    width: 80,
    height: 3,
    backgroundColor: Colors.teal,
    borderRadius: 2,
  },
  quickActionsSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickActionButton: {
    width: '31%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadow.soft,
  },
  quickActionIcon: {
    width: IconSizes.xxlarge,
    height: IconSizes.xxlarge,
    borderRadius: IconSizes.xxlarge / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
    textAlign: 'center',
  },
});

