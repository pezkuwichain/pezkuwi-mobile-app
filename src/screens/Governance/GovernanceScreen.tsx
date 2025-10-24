import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { kycService } from '../../services/kycService';

export default function GovernanceScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const access = await kycService.hasGovernanceAccess();
      setHasAccess(access);
    } catch (error) {
      console.error('Failed to check governance access:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.mint} />
      </SafeAreaView>
    );
  }

  // If user doesn't have access (KYC not approved)
  if (!hasAccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Governance (Welati)</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.lockedCard}>
            <Ionicons name="lock-closed" size={60} color={Colors.textGray} />
            <Text style={styles.lockedTitle}>Access Restricted</Text>
            <Text style={styles.lockedSubtitle}>
              You need to complete Identity KYC verification to access Governance features.
            </Text>
          </View>

          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Requirements:</Text>
            <View style={styles.requirementItem}>
              <Ionicons name="person-outline" size={20} color={Colors.teal} />
              <Text style={styles.requirementText}>Complete Identity KYC form</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.teal} />
              <Text style={styles.requirementText}>Get KYC approval on blockchain</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="card-outline" size={20} color={Colors.teal} />
              <Text style={styles.requirementText}>Receive Kurdistan Digital Citizen card</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => navigation.navigate('Identity')}
          >
            <Text style={styles.completeButtonText}>Complete Identity KYC</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If user has access, show governance features
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Governance (Welati)</Text>
        <View style={styles.citizenBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.mint} />
          <Text style={styles.citizenBadgeText}>Verified Citizen</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Active Proposals</Text>
        <Text style={styles.comingSoon}>Coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textDark },
  content: { flex: 1, padding: Spacing.xl },
  lockedCard: { backgroundColor: Colors.card, padding: Spacing.xxxl, borderRadius: BorderRadius.xlarge, alignItems: 'center', ...Shadow.soft },
  lockedTitle: { fontSize: 24, fontWeight: '700', color: Colors.textDark, marginTop: Spacing.lg },
  lockedSubtitle: { fontSize: 16, color: Colors.textGray, marginTop: Spacing.sm, textAlign: 'center', lineHeight: 24 },
  requirementsCard: { backgroundColor: Colors.teal + '20', padding: Spacing.xl, borderRadius: BorderRadius.large, marginTop: Spacing.xl },
  requirementsTitle: { fontSize: 18, fontWeight: '600', color: Colors.textDark, marginBottom: Spacing.md },
  requirementItem: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.sm },
  requirementText: { fontSize: 16, color: Colors.textDark },
  completeButton: { flexDirection: 'row', backgroundColor: Colors.teal, borderRadius: BorderRadius.xxlarge, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxxl, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xl, gap: Spacing.sm, ...Shadow.soft },
  completeButtonText: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
  citizenBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.mint + '20', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: BorderRadius.large, marginTop: Spacing.sm, gap: Spacing.xs, alignSelf: 'flex-start' },
  citizenBadgeText: { fontSize: 14, fontWeight: '600', color: Colors.mint },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: Colors.textDark, marginBottom: Spacing.md },
  comingSoon: { fontSize: 16, color: Colors.textGray, textAlign: 'center', marginTop: Spacing.xl },
});
