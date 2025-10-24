import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SendModal from '../../components/SendModal';
import ReceiveModal from '../../components/ReceiveModal';
import WalletService from '../../services/WalletService';
import Colors from '../../constants/colors';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  token: 'HEZ' | 'PEZ';
  amount: string;
  address: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export default function WalletScreen({ navigation, route }: any) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState({ hez: '0', pez: '0' });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [selectedToken, setSelectedToken] = useState<'HEZ' | 'PEZ'>('HEZ');

  useEffect(() => {
    checkWalletAndLoad();
  }, []);

  useEffect(() => {
    // Check if coming from quick actions with action parameter
    if (route.params?.action === 'send') {
      if (hasWallet) {
        setSendModalVisible(true);
      }
    } else if (route.params?.action === 'receive') {
      if (hasWallet) {
        setReceiveModalVisible(true);
      }
    }
  }, [route.params, hasWallet]);

  const checkWalletAndLoad = async () => {
    try {
      setLoading(true);
      const walletExists = await WalletService.hasWallet();
      
      if (!walletExists) {
        setHasWallet(false);
        setLoading(false);
        return;
      }

      setHasWallet(true);
      await loadWalletData();
    } catch (error) {
      console.error('Failed to check wallet:', error);
      setHasWallet(false);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletData = async () => {
    try {
      await WalletService.loadWallet();
      
      const walletAddress = await WalletService.getAddress();
      if (walletAddress) {
        setAddress(walletAddress);
      }

      const walletBalance = await WalletService.getBalance();
      setBalance(walletBalance);

      const txHistory = await WalletService.getTransactionHistory();
      setTransactions(txHistory);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const handleSend = (token: 'HEZ' | 'PEZ') => {
    setSelectedToken(token);
    setSendModalVisible(true);
  };

  const handleReceive = (token: 'HEZ' | 'PEZ') => {
    setSelectedToken(token);
    setReceiveModalVisible(true);
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const getTransactionIcon = (type: string) => {
    return type === 'send' ? 'arrow-up' : 'arrow-down';
  };

  const getTransactionColor = (type: string) => {
    return type === 'send' ? Colors.error : Colors.success;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  // Show onboarding if no wallet
  if (!hasWallet) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.primary, Colors.coral]}
          style={styles.onboardingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.onboardingContent}>
            <View style={styles.onboardingIcon}>
              <Ionicons name="wallet-outline" size={80} color="white" />
            </View>
            <Text style={styles.onboardingTitle}>No Wallet Found</Text>
            <Text style={styles.onboardingSubtitle}>
              Create a new wallet or import an existing one to get started
            </Text>
            
            <View style={styles.onboardingButtons}>
              <TouchableOpacity
                style={styles.onboardingButton}
                onPress={() => navigation.navigate('WalletOnboarding')}
                activeOpacity={0.8}
              >
                <Text style={styles.onboardingButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.coral]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>My Wallet</Text>
              <TouchableOpacity
                style={styles.addressContainer}
                onPress={() => setReceiveModalVisible(true)}
              >
                <Text style={styles.addressText}>{formatAddress(address)}</Text>
                <Ionicons name="copy-outline" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Balance Cards */}
        <View style={styles.balanceSection}>
          {/* HEZ Card */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={['#98D8C8', '#6FB8A8']}
              style={styles.balanceCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.balanceCardHeader}>
                <View style={styles.tokenInfo}>
                  <View style={styles.tokenIcon}>
                    <Ionicons name="shield" size={24} color="white" />
                  </View>
                  <View>
                    <Text style={styles.tokenSymbol}>HEZ</Text>
                    <Text style={styles.tokenName}>Hemwelatî</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.balanceAmount}>{balance.hez}</Text>
              <Text style={styles.balanceLabel}>Security Token</Text>
              
              <View style={styles.balanceActions}>
                <TouchableOpacity
                  style={styles.balanceActionButton}
                  onPress={() => handleSend('HEZ')}
                >
                  <Ionicons name="arrow-up" size={18} color="white" />
                  <Text style={styles.balanceActionText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.balanceActionButton}
                  onPress={() => handleReceive('HEZ')}
                >
                  <Ionicons name="arrow-down" size={18} color="white" />
                  <Text style={styles.balanceActionText}>Receive</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* PEZ Card */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={['#E8C896', '#D4A574']}
              style={styles.balanceCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.balanceCardHeader}>
                <View style={styles.tokenInfo}>
                  <View style={styles.tokenIcon}>
                    <Ionicons name="star" size={24} color="white" />
                  </View>
                  <View>
                    <Text style={styles.tokenSymbol}>PEZ</Text>
                    <Text style={styles.tokenName}>PezkuwiChain</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.balanceAmount}>{balance.pez}</Text>
              <Text style={styles.balanceLabel}>Governance Token</Text>
              
              <View style={styles.balanceActions}>
                <TouchableOpacity
                  style={styles.balanceActionButton}
                  onPress={() => handleSend('PEZ')}
                >
                  <Ionicons name="arrow-up" size={18} color="white" />
                  <Text style={styles.balanceActionText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.balanceActionButton}
                  onPress={() => handleReceive('PEZ')}
                >
                  <Ionicons name="arrow-down" size={18} color="white" />
                  <Text style={styles.balanceActionText}>Receive</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Exchange')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name="swap-horizontal" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>Swap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.success + '20' }]}>
              <Ionicons name="qr-code" size={24} color={Colors.success} />
            </View>
            <Text style={styles.quickActionLabel}>Scan QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Rewards')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Colors.kurdishGold + '20' }]}>
              <Ionicons name="gift" size={24} color={Colors.kurdishGold} />
            </View>
            <Text style={styles.quickActionLabel}>Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={Colors.textGray} />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Your transaction history will appear here
              </Text>
            </View>
          ) : (
            transactions.map((tx) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View
                  style={[
                    styles.transactionIcon,
                    { backgroundColor: getTransactionColor(tx.type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getTransactionIcon(tx.type)}
                    size={20}
                    color={getTransactionColor(tx.type)}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>
                    {tx.type === 'send' ? 'Sent' : 'Received'} {tx.token}
                  </Text>
                  <Text style={styles.transactionAddress}>
                    {formatAddress(tx.address)}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text
                    style={[
                      styles.transactionAmountText,
                      { color: getTransactionColor(tx.type) },
                    ]}
                  >
                    {tx.type === 'send' ? '-' : '+'}{tx.amount}
                  </Text>
                  <Text style={styles.transactionStatus}>{tx.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Send Modal */}
      <SendModal
        visible={sendModalVisible}
        onClose={() => setSendModalVisible(false)}
        token={selectedToken}
        balance={selectedToken === 'HEZ' ? balance.hez : balance.pez}
        onSend={async (to, amount) => {
          try {
            await WalletService.sendTokens(to, amount, selectedToken);
            setSendModalVisible(false);
            await loadWalletData();
          } catch (error) {
            console.error('Send failed:', error);
          }
        }}
      />

      {/* Receive Modal */}
      <ReceiveModal
        visible={receiveModalVisible}
        onClose={() => setReceiveModalVisible(false)}
        address={address}
        token={selectedToken}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textGray,
  },
  onboardingGradient: {
    flex: 1,
  },
  onboardingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  onboardingIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  onboardingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  onboardingButtons: {
    width: '100%',
  },
  onboardingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
  },
  onboardingButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceSection: {
    paddingHorizontal: 20,
    marginTop: -40,
    gap: 16,
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  balanceCardGradient: {
    padding: 20,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  tokenName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  balanceActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  balanceActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textDark,
  },
  transactionsSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textGray,
    marginTop: 8,
    textAlign: 'center',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  transactionAddress: {
    fontSize: 12,
    color: Colors.textGray,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 11,
    color: Colors.textGray,
    textTransform: 'capitalize',
  },
});

