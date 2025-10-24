import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Colors from '../../constants/colors';

interface BusinessStats {
  totalSales: number;
  todaySales: number;
  pendingPayments: number;
  totalCustomers: number;
}

interface Transaction {
  id: string;
  customer: string;
  amount: number;
  token: 'HEZ' | 'PEZ';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  invoiceId: string;
}

export default function BusinessScreen({ navigation }: any) {
  const [merchantAddress] = useState('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<'HEZ' | 'PEZ'>('PEZ');
  const [paymentNote, setPaymentNote] = useState('');

  const [stats] = useState<BusinessStats>({
    totalSales: 125450,
    todaySales: 3250,
    pendingPayments: 850,
    totalCustomers: 342,
  });

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      customer: 'Ahmed Karwan',
      amount: 500,
      token: 'PEZ',
      date: '2024-01-23 14:30',
      status: 'completed',
      invoiceId: 'INV-2024-001',
    },
    {
      id: '2',
      customer: 'Layla Sherzad',
      amount: 1250,
      token: 'HEZ',
      date: '2024-01-23 12:15',
      status: 'completed',
      invoiceId: 'INV-2024-002',
    },
    {
      id: '3',
      customer: 'Saman Aziz',
      amount: 750,
      token: 'PEZ',
      date: '2024-01-23 10:45',
      status: 'pending',
      invoiceId: 'INV-2024-003',
    },
    {
      id: '4',
      customer: 'Hana Dilshad',
      amount: 350,
      token: 'PEZ',
      date: '2024-01-22 16:20',
      status: 'completed',
      invoiceId: 'INV-2024-004',
    },
  ]);

  const generatePaymentQR = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount');
      return;
    }
    setShowPaymentModal(true);
  };

  const copyMerchantAddress = async () => {
    await Clipboard.setStringAsync(merchantAddress);
    Alert.alert('✓ Copied!', 'Merchant address copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'failed':
        return Colors.error;
      default:
        return Colors.textGray;
    }
  };

  const paymentData = JSON.stringify({
    merchant: merchantAddress,
    amount: paymentAmount,
    token: selectedToken,
    note: paymentNote,
    timestamp: Date.now(),
  });

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
            <View>
              <Text style={styles.headerTitle}>Business Hub</Text>
              <Text style={styles.headerSubtitle}>Merchant Payment Center</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => Alert.alert('Settings', 'Business settings coming soon')}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="cash" size={28} color={Colors.success} />
              <Text style={styles.statValue}>{stats.totalSales.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Sales (PEZ)</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={28} color={Colors.primary} />
              <Text style={styles.statValue}>{stats.todaySales.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Today's Sales</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={28} color={Colors.warning} />
              <Text style={styles.statValue}>{stats.pendingPayments.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people" size={28} color={Colors.kurdishGold} />
              <Text style={styles.statValue}>{stats.totalCustomers}</Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Ionicons name="qr-code" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Generate QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.success + '20' }]}>
                <Ionicons name="document-text" size={32} color={Colors.success} />
              </View>
              <Text style={styles.actionLabel}>Create Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.kurdishGold + '20' }]}>
                <Ionicons name="stats-chart" size={32} color={Colors.kurdishGold} />
              </View>
              <Text style={styles.actionLabel}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.coral + '20' }]}>
                <Ionicons name="card" size={32} color={Colors.coral} />
              </View>
              <Text style={styles.actionLabel}>Payment Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Request Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Payment Request</Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Token</Text>
              <View style={styles.tokenSelector}>
                <TouchableOpacity
                  style={[
                    styles.tokenOption,
                    selectedToken === 'PEZ' && styles.tokenOptionActive,
                  ]}
                  onPress={() => setSelectedToken('PEZ')}
                >
                  <Text
                    style={[
                      styles.tokenOptionText,
                      selectedToken === 'PEZ' && styles.tokenOptionTextActive,
                    ]}
                  >
                    PEZ
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tokenOption,
                    selectedToken === 'HEZ' && styles.tokenOptionActive,
                  ]}
                  onPress={() => setSelectedToken('HEZ')}
                >
                  <Text
                    style={[
                      styles.tokenOptionText,
                      selectedToken === 'HEZ' && styles.tokenOptionTextActive,
                    ]}
                  >
                    HEZ
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Note (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Payment description"
                multiline
                numberOfLines={3}
                value={paymentNote}
                onChangeText={setPaymentNote}
              />
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={generatePaymentQR}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.success]}
                style={styles.generateButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="qr-code" size={20} color="white" />
                <Text style={styles.generateButtonText}>Generate Payment QR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <View style={styles.transactionIcon}>
                  <Ionicons
                    name={
                      transaction.status === 'completed'
                        ? 'checkmark-circle'
                        : transaction.status === 'pending'
                        ? 'time'
                        : 'close-circle'
                    }
                    size={24}
                    color={getStatusColor(transaction.status)}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCustomer}>
                    {transaction.customer}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                  <Text style={styles.transactionInvoice}>
                    {transaction.invoiceId}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={styles.amountValue}>
                    {transaction.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.amountToken}>{transaction.token}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(transaction.status) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(transaction.status) },
                  ]}
                >
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Merchant Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Merchant Information</Text>
          <View style={styles.merchantCard}>
            <View style={styles.merchantHeader}>
              <Ionicons name="storefront" size={24} color={Colors.primary} />
              <Text style={styles.merchantTitle}>Your Merchant Address</Text>
            </View>
            <TouchableOpacity
              style={styles.addressBox}
              onPress={copyMerchantAddress}
              activeOpacity={0.7}
            >
              <Text style={styles.addressText} numberOfLines={1}>
                {merchantAddress}
              </Text>
              <Ionicons name="copy-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.merchantNote}>
              Share this address with customers to receive payments
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Payment QR Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment QR Code</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={28} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer}>
              <QRCode value={paymentData} size={200} />
            </View>

            <View style={styles.paymentDetails}>
              <View style={styles.paymentDetailRow}>
                <Text style={styles.paymentDetailLabel}>Amount:</Text>
                <Text style={styles.paymentDetailValue}>
                  {paymentAmount} {selectedToken}
                </Text>
              </View>
              {paymentNote ? (
                <View style={styles.paymentDetailRow}>
                  <Text style={styles.paymentDetailLabel}>Note:</Text>
                  <Text style={styles.paymentDetailValue}>{paymentNote}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.qrInstruction}>
              Ask customer to scan this QR code with their PezkuwiChain app
            </Text>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
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
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textDark,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tokenSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  tokenOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  tokenOptionActive: {
    backgroundColor: Colors.primary,
  },
  tokenOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textGray,
  },
  tokenOptionTextActive: {
    color: 'white',
  },
  generateButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textGray,
    marginBottom: 2,
  },
  transactionInvoice: {
    fontSize: 11,
    color: Colors.textGray,
    fontFamily: 'monospace',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
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
  merchantCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  merchantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  merchantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textDark,
    fontFamily: 'monospace',
    marginRight: 8,
  },
  merchantNote: {
    fontSize: 12,
    color: Colors.textGray,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textDark,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginBottom: 20,
  },
  paymentDetails: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: Colors.textGray,
  },
  paymentDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  qrInstruction: {
    fontSize: 13,
    color: Colors.textGray,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

