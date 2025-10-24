import React, { useState, useEffect } from 'react';
import SendModal from '../../components/SendModal';
import ReceiveModal from '../../components/ReceiveModal';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';

interface CoinRow {
  symbol: string;
  name: string;
  amount: string;
  network: string;
  icon: any;
  color: string;
}

export default function WalletScreen({ navigation, route }: any) {
  const [withdrawalAddresses, setWithdrawalAddresses] = useState<{ [key: string]: string }>({});
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [selectedToken, setSelectedToken] = useState<CoinRow | null>(null);
  const [totalReward] = useState('50000');
  const [trustScore] = useState('150000');
  const [totalReferral] = useState('500');
  const [circleScore] = useState('30000');
  const [eduScore] = useState('1000');
  const [stakeAmount] = useState('1000');

  const coins: CoinRow[] = [
    {
      symbol: 'PEZ',
      name: 'PezkuwiChain',
      amount: '100',
      network: 'op',
      icon: require('../../../assets/tokens/pez.png'),
      color: '#E8C896',
    },
    {
      symbol: 'HEZ',
      name: 'Hemwelatî',
      amount: '100',
      network: 'op',
      icon: require('../../../assets/tokens/hez.png'),
      color: '#98D8C8',
    },
  ];

  const handleWithdraw = (coin: CoinRow) => {
    setSelectedToken(coin);
    setSendModalVisible(true);
  };

  const handleDeposit = (coin: CoinRow) => {
    setSelectedToken(coin);
    setReceiveModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Colorful Top Band */}
      <View style={styles.topBand}>
        <View style={[styles.bandSegment, { backgroundColor: '#E74C3C' }]} />
        <View style={[styles.bandSegment, { backgroundColor: '#27AE60' }]} />
        <View style={[styles.bandSegment, { backgroundColor: '#3498DB' }]} />
        <View style={[styles.bandSegment, { backgroundColor: '#F39C12' }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainSection}>
          {/* NFT Card - Top Right */}
          <View style={styles.nftCard}>
            <View style={styles.nftHeader}>
              <Text style={styles.nftLabel}>NFT</Text>
              <Text style={styles.nftId}>123456784444444444444444912</Text>
            </View>
            <View style={styles.nftBody}>
              <View style={styles.nftAvatar}>
                <Ionicons name="person" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.nftName}>Satoshi Qazi M.</Text>
            </View>
            <View style={styles.nftFooter}>
              <Ionicons name="trophy" size={20} color="#D4A017" />
              <Text style={styles.nftRewardLabel}>TOTAL REWARD</Text>
              <Text style={styles.nftRewardValue}>{totalReward}</Text>
            </View>
          </View>

          {/* Coins Table */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 1 }]}>coin</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>amount</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Network</Text>
              <Text style={[styles.headerCell, { flex: 3 }]}>Witdrawal adress</Text>
              <Text style={[styles.headerCell, { flex: 1.5 }]}>withdraw deposit</Text>
            </View>

            {/* Table Rows */}
            {coins.map((coin) => (
              <View key={coin.symbol} style={styles.tableRow}>
                {/* Coin */}
                <View style={[styles.cell, { flex: 1 }]}>
                  <Image source={coin.icon} style={styles.coinIcon} />
                  <Text style={styles.coinSymbol}>{coin.symbol}</Text>
                </View>

                {/* Amount */}
                <View style={[styles.cell, { flex: 1 }]}>
                  <Text style={styles.cellText}>{coin.amount}</Text>
                </View>

                {/* Network */}
                <View style={[styles.cell, { flex: 1 }]}>
                  <Text style={styles.cellText}>{coin.network}</Text>
                </View>

                {/* Withdrawal Address */}
                <View style={[styles.cell, { flex: 3 }]}>
                  <TextInput
                    style={styles.addressInput}
                    placeholder="Withdrawal adresinizi yazin"
                    placeholderTextColor="#999"
                    value={withdrawalAddresses[coin.symbol] || ''}
                    onChangeText={(text) =>
                      setWithdrawalAddresses({ ...withdrawalAddresses, [coin.symbol]: text })
                    }
                  />
                </View>

                {/* Withdraw/Deposit Buttons */}
                <View style={[styles.cell, { flex: 1.5, flexDirection: 'row', gap: 8 }]}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleWithdraw(coin)}
                  >
                    <View style={styles.withdrawButton}>
                      <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeposit(coin)}
                  >
                    <View style={styles.depositButton}>
                      <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Stats Cards */}
        <View style={styles.statsSection}>
          {/* Stake/Unstake Card */}
          <View style={[styles.statsCard, { backgroundColor: '#FFFFFF' }]}>
            <TouchableOpacity style={styles.stakeButton}>
              <Text style={styles.stakeLabel}>STAKE</Text>
              <Text style={styles.stakeValue}>{stakeAmount}</Text>
              <View style={styles.stakeIcon}>
                <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.stakeDivider} />

            <TouchableOpacity style={styles.unstakeButton}>
              <Text style={styles.unstakeLabel}>UNSTAKE</Text>
              <Text style={styles.unstakeValue}>{stakeAmount}</Text>
              <View style={styles.unstakeIcon}>
                <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Trust Score */}
          <TouchableOpacity
            style={[styles.statsCard, styles.scoreCard]}
            onPress={() => navigation.navigate('TrustScore')}
          >
            <Ionicons name="shield-checkmark" size={32} color="#D4A017" />
            <Text style={styles.scoreLabel}>TRUST SCORE</Text>
            <Text style={styles.scoreValue}>{trustScore}</Text>
          </TouchableOpacity>

          {/* Total Referral */}
          <TouchableOpacity
            style={[styles.statsCard, styles.scoreCard]}
            onPress={() => navigation.navigate('Referral')}
          >
            <Ionicons name="people" size={32} color="#D4A017" />
            <Text style={styles.scoreLabel}>TOTAL REFERAL</Text>
            <Text style={styles.scoreValue}>{totalReferral}</Text>
          </TouchableOpacity>

          {/* Circle Score */}
          <TouchableOpacity style={[styles.statsCard, styles.scoreCard]}>
            <Ionicons name="radio-button-on" size={32} color="#D4A017" />
            <Text style={styles.scoreLabel}>CIRCLE SCORE</Text>
            <Text style={styles.scoreValue}>{circleScore}</Text>
          </TouchableOpacity>

          {/* Edu Score */}
          <TouchableOpacity
            style={[styles.statsCard, styles.scoreCard]}
            onPress={() => navigation.navigate('Education')}
          >
            <Ionicons name="school" size={32} color="#D4A017" />
            <Text style={styles.scoreLabel}>EDU. SCORE</Text>
            <Text style={styles.scoreValue}>{eduScore}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Send Modal */}
      {selectedToken && (
        <SendModal
          visible={sendModalVisible}
          onClose={() => setSendModalVisible(false)}
          token={{
            symbol: selectedToken.symbol,
            name: selectedToken.name,
            balance: selectedToken.amount,
            icon: selectedToken.icon,
            color: selectedToken.color,
          }}
        />
      )}

      {/* Receive Modal */}
      {selectedToken && (
        <ReceiveModal
          visible={receiveModalVisible}
          onClose={() => setReceiveModalVisible(false)}
          token={{
            symbol: selectedToken.symbol,
            name: selectedToken.name,
            icon: selectedToken.icon,
            color: selectedToken.color,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0F7',
  },
  topBand: {
    flexDirection: 'row',
    height: 8,
  },
  bandSegment: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  mainSection: {
    padding: Spacing.lg,
    position: 'relative',
  },
  nftCard: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    ...Shadow.medium,
    zIndex: 10,
  },
  nftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  nftLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDark,
  },
  nftId: {
    fontSize: 8,
    color: Colors.textGray,
  },
  nftBody: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  nftAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  nftName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  nftFooter: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Spacing.sm,
  },
  nftRewardLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textGray,
    marginTop: 4,
  },
  nftRewardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 2,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginRight: 160,
    ...Shadow.small,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    marginBottom: Spacing.sm,
  },
  headerCell: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinIcon: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  coinSymbol: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 2,
  },
  cellText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textDark,
  },
  addressInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    fontSize: 10,
    color: Colors.textDark,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawButton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  depositButton: {
    width: '100%',
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
    ...Shadow.small,
  },
  stakeButton: {
    alignItems: 'center',
  },
  stakeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDark,
  },
  stakeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginVertical: Spacing.xs,
  },
  stakeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stakeDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: Spacing.md,
  },
  unstakeButton: {
    alignItems: 'center',
  },
  unstakeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textDark,
  },
  unstakeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginVertical: Spacing.xs,
  },
  unstakeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCard: {
    alignItems: 'center',
    minWidth: 110,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: Spacing.xs,
  },
});

