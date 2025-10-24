import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';

interface ExchangeRate {
  hezToPez: number;
  pezToHez: number;
  lastUpdated: string;
}

interface SwapHistory {
  id: string;
  fromToken: 'HEZ' | 'PEZ';
  toToken: 'HEZ' | 'PEZ';
  fromAmount: number;
  toAmount: number;
  rate: number;
  date: string;
  txHash: string;
}

export default function ExchangeScreen({ navigation }: any) {
  const [fromToken, setFromToken] = useState<'HEZ' | 'PEZ'>('HEZ');
  const [toToken, setToToken] = useState<'HEZ' | 'PEZ'>('PEZ');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const [balances] = useState({
    hez: 45750.5,
    pez: 1234567,
  });

  const [exchangeRate] = useState<ExchangeRate>({
    hezToPez: 27.5,
    pezToHez: 0.0364,
    lastUpdated: new Date().toLocaleTimeString(),
  });

  const [swapHistory] = useState<SwapHistory[]>([
    {
      id: '1',
      fromToken: 'HEZ',
      toToken: 'PEZ',
      fromAmount: 100,
      toAmount: 2750,
      rate: 27.5,
      date: '2024-01-23 14:30',
      txHash: '0x1a2b3c...',
    },
    {
      id: '2',
      fromToken: 'PEZ',
      toToken: 'HEZ',
      fromAmount: 5000,
      toAmount: 182,
      rate: 0.0364,
      date: '2024-01-22 10:15',
      txHash: '0x4d5e6f...',
    },
  ]);

  useEffect(() => {
    calculateToAmount();
  }, [fromAmount, fromToken, toToken]);

  const calculateToAmount = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount('');
      return;
    }

    const amount = parseFloat(fromAmount);
    let result = 0;

    if (fromToken === 'HEZ' && toToken === 'PEZ') {
      result = amount * exchangeRate.hezToPez;
    } else if (fromToken === 'PEZ' && toToken === 'HEZ') {
      result = amount * exchangeRate.pezToHez;
    }

    // Apply slippage
    const slippagePercent = parseFloat(slippage) / 100;
    result = result * (1 - slippagePercent);

    setToAmount(result.toFixed(4));
  };

  const swapTokens = () => {
    const newFromToken = toToken;
    const newToToken = fromToken;
    setFromToken(newFromToken);
    setToToken(newToToken);
    setFromAmount(toAmount);
  };

  const executeSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to swap');
      return;
    }

    const amount = parseFloat(fromAmount);
    const currentBalance = fromToken === 'HEZ' ? balances.hez : balances.pez;

    if (amount > currentBalance) {
      Alert.alert('Insufficient Balance', `You don't have enough ${fromToken}`);
      return;
    }

    Alert.alert(
      'Confirm Swap',
      `Swap ${fromAmount} ${fromToken} for ${toAmount} ${toToken}?\n\nRate: 1 ${fromToken} = ${
        fromToken === 'HEZ' ? exchangeRate.hezToPez : exchangeRate.pezToHez
      } ${toToken}\nSlippage: ${slippage}%`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert(
              'Success!',
              `Swap executed successfully!\n\nTransaction hash: 0x${Math.random()
                .toString(16)
                .substr(2, 8)}...`
            );
            setFromAmount('');
            setToAmount('');
          },
        },
      ]
    );
  };

  const setMaxAmount = () => {
    const maxBalance = fromToken === 'HEZ' ? balances.hez : balances.pez;
    setFromAmount(maxBalance.toString());
  };

  const getCurrentRate = () => {
    return fromToken === 'HEZ' ? exchangeRate.hezToPez : exchangeRate.pezToHez;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.kurdishGold]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Exchange</Text>
              <Text style={styles.headerSubtitle}>Swap HEZ ↔ PEZ Tokens</Text>
            </View>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => Alert.alert('History', 'Full swap history coming soon')}
            >
              <Ionicons name="time-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Exchange Rate Card */}
        <View style={styles.rateContainer}>
          <View style={styles.rateCard}>
            <View style={styles.rateHeader}>
              <Text style={styles.rateTitle}>Current Exchange Rate</Text>
              <View style={styles.updateBadge}>
                <Ionicons name="sync" size={12} color={Colors.success} />
                <Text style={styles.updateText}>Live</Text>
              </View>
            </View>
            <View style={styles.rateContent}>
              <View style={styles.rateItem}>
                <Text style={styles.rateLabel}>1 HEZ =</Text>
                <Text style={styles.rateValue}>{exchangeRate.hezToPez} PEZ</Text>
              </View>
              <View style={styles.rateDivider} />
              <View style={styles.rateItem}>
                <Text style={styles.rateLabel}>1 PEZ =</Text>
                <Text style={styles.rateValue}>{exchangeRate.pezToHez} HEZ</Text>
              </View>
            </View>
            <Text style={styles.rateUpdate}>
              Last updated: {exchangeRate.lastUpdated}
            </Text>
          </View>
        </View>

        {/* Swap Interface */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Swap Tokens</Text>

          {/* From Token */}
          <View style={styles.swapCard}>
            <View style={styles.swapHeader}>
              <Text style={styles.swapLabel}>From</Text>
              <Text style={styles.balanceText}>
                Balance: {fromToken === 'HEZ' ? balances.hez.toLocaleString() : balances.pez.toLocaleString()} {fromToken}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={fromAmount}
                onChangeText={setFromAmount}
              />
              <View style={styles.tokenSelector}>
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenText}>{fromToken}</Text>
                </View>
                <TouchableOpacity onPress={setMaxAmount} style={styles.maxButton}>
                  <Text style={styles.maxButtonText}>MAX</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Swap Button */}
          <View style={styles.swapButtonContainer}>
            <TouchableOpacity
              style={styles.swapIconButton}
              onPress={swapTokens}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-vertical" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* To Token */}
          <View style={styles.swapCard}>
            <View style={styles.swapHeader}>
              <Text style={styles.swapLabel}>To</Text>
              <Text style={styles.balanceText}>
                Balance: {toToken === 'HEZ' ? balances.hez.toLocaleString() : balances.pez.toLocaleString()} {toToken}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.amountInput, styles.amountInputDisabled]}
                placeholder="0.00"
                value={toAmount}
                editable={false}
              />
              <View style={styles.tokenSelector}>
                <View style={styles.tokenBadge}>
                  <Text style={styles.tokenText}>{toToken}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Swap Details */}
          {fromAmount && toAmount && (
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rate</Text>
                <Text style={styles.detailValue}>
                  1 {fromToken} = {getCurrentRate()} {toToken}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Slippage Tolerance</Text>
                <View style={styles.slippageSelector}>
                  <TouchableOpacity
                    style={[
                      styles.slippageOption,
                      slippage === '0.5' && styles.slippageOptionActive,
                    ]}
                    onPress={() => setSlippage('0.5')}
                  >
                    <Text
                      style={[
                        styles.slippageText,
                        slippage === '0.5' && styles.slippageTextActive,
                      ]}
                    >
                      0.5%
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.slippageOption,
                      slippage === '1.0' && styles.slippageOptionActive,
                    ]}
                    onPress={() => setSlippage('1.0')}
                  >
                    <Text
                      style={[
                        styles.slippageText,
                        slippage === '1.0' && styles.slippageTextActive,
                      ]}
                    >
                      1.0%
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.slippageOption,
                      slippage === '2.0' && styles.slippageOptionActive,
                    ]}
                    onPress={() => setSlippage('2.0')}
                  >
                    <Text
                      style={[
                        styles.slippageText,
                        slippage === '2.0' && styles.slippageTextActive,
                      ]}
                    >
                      2.0%
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Network Fee</Text>
                <Text style={styles.detailValue}>~0.01 HEZ</Text>
              </View>
            </View>
          )}

          {/* Execute Swap Button */}
          <TouchableOpacity
            style={styles.executeButton}
            onPress={executeSwap}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.success]}
              style={styles.executeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="swap-horizontal" size={20} color="white" />
              <Text style={styles.executeButtonText}>Swap Tokens</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Swaps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Swaps</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {swapHistory.map((swap) => (
            <View key={swap.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyIcon}>
                  <Ionicons
                    name="swap-horizontal"
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>
                    {swap.fromToken} → {swap.toToken}
                  </Text>
                  <Text style={styles.historyDate}>{swap.date}</Text>
                  <Text style={styles.historyHash}>Tx: {swap.txHash}</Text>
                </View>
                <View style={styles.historyAmount}>
                  <Text style={styles.historyFromAmount}>
                    -{swap.fromAmount} {swap.fromToken}
                  </Text>
                  <Text style={styles.historyToAmount}>
                    +{swap.toAmount} {swap.toToken}
                  </Text>
                </View>
              </View>
              <View style={styles.historyFooter}>
                <Text style={styles.historyRate}>
                  Rate: 1 {swap.fromToken} = {swap.rate} {swap.toToken}
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="open-outline"
                    size={16}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>About Token Swap</Text>
              <Text style={styles.infoText}>
                Exchange rates are determined by the on-chain liquidity pool. HEZ is the security layer token, while PEZ is the governance token. Swap fees support network validators and liquidity providers.
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
  historyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  rateCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  updateText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  rateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rateItem: {
    flex: 1,
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    color: Colors.textGray,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  rateDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.background,
  },
  rateUpdate: {
    fontSize: 12,
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
  swapCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  swapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  swapLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textGray,
  },
  balanceText: {
    fontSize: 12,
    color: Colors.textGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textDark,
  },
  amountInputDisabled: {
    color: Colors.textGray,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tokenBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tokenText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  maxButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  maxButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: -12,
    zIndex: 10,
  },
  swapIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textGray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  slippageSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  slippageOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  slippageOptionActive: {
    backgroundColor: Colors.primary,
  },
  slippageText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textGray,
  },
  slippageTextActive: {
    color: 'white',
  },
  executeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  executeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  executeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  historyCard: {
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
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textGray,
    marginBottom: 2,
  },
  historyHash: {
    fontSize: 11,
    color: Colors.textGray,
    fontFamily: 'monospace',
  },
  historyAmount: {
    alignItems: 'flex-end',
  },
  historyFromAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 2,
  },
  historyToAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  historyRate: {
    fontSize: 12,
    color: Colors.textGray,
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

