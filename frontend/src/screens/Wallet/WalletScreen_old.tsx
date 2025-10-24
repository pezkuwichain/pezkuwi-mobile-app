import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';

export default function WalletScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Wallet</Text>
        
        {/* HEZ Card */}
        <LinearGradient
          colors={Colors.gradients.hezCard}
          style={styles.tokenCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.tokenHeader}>
            <Text style={styles.tokenName}>HEZ</Text>
            <Text style={styles.tokenSubtitle}>The People's Currency</Text>
          </View>
          <Text style={styles.tokenBalance}>45,750.5</Text>
          <Text style={styles.tokenUsd}>$45,234 USD</Text>
          <Text style={styles.tokenStaked}>Staked: 30,000 HEZ</Text>
        </LinearGradient>

        {/* PEZ Card */}
        <LinearGradient
          colors={Colors.gradients.pezCard}
          style={styles.tokenCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.tokenHeader}>
            <Text style={styles.tokenName}>PEZ</Text>
            <Text style={styles.tokenSubtitle}>Governance Token</Text>
          </View>
          <Text style={styles.tokenBalance}>1,234,567</Text>
          <Text style={styles.tokenUsd}>$123,456 USD</Text>
          <Text style={styles.tokenStaked}>Governance Power: 2.5%</Text>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.peach }]}>
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.teal }]}>
            <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <Ionicons name="arrow-forward" size={20} color={Colors.coral} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Sent HEZ</Text>
              <Text style={styles.transactionDate}>Yesterday</Text>
            </View>
            <Text style={styles.transactionAmount}>-500 HEZ</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textDark, padding: 20 },
  tokenCard: { margin: 20, padding: 24, borderRadius: 20, ...Shadow.soft },
  tokenHeader: { marginBottom: 16 },
  tokenName: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  tokenSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  tokenBalance: { fontSize: 36, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  tokenUsd: { fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  tokenStaked: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  actions: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.textDark, marginBottom: 16 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, padding: 16, borderRadius: 12, marginBottom: 12 },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '600', color: Colors.textDark },
  transactionDate: { fontSize: 14, color: Colors.textGray, marginTop: 4 },
  transactionAmount: { fontSize: 16, fontWeight: '600', color: Colors.coral },
});
