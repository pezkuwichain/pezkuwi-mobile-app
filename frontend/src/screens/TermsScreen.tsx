import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.updateDate}>Last Updated: November 8, 2025</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using PezkuwiChain mobile application ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
        </Text>

        <Text style={styles.sectionTitle}>2. User Accounts</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
        </Text>

        <Text style={styles.sectionTitle}>3. Digital Assets</Text>
        <Text style={styles.paragraph}>
          PezkuwiChain provides wallet services for digital assets (HEZ, PEZ tokens). You acknowledge that:
        </Text>
        <Text style={styles.bulletPoint}>• You are solely responsible for your wallet security</Text>
        <Text style={styles.bulletPoint}>• Loss of private keys may result in permanent loss of assets</Text>
        <Text style={styles.bulletPoint}>• Transactions on blockchain are irreversible</Text>
        <Text style={styles.bulletPoint}>• We do not custody your private keys or assets</Text>

        <Text style={styles.sectionTitle}>4. Prohibited Activities</Text>
        <Text style={styles.paragraph}>You agree not to:</Text>
        <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
        <Text style={styles.bulletPoint}>• Use the Service for fraudulent purposes</Text>
        <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
        <Text style={styles.bulletPoint}>• Interfere with or disrupt the Service</Text>

        <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The Service and its original content, features, and functionality are owned by PezkuwiChain and are protected by international copyright, trademark, and other intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, PezkuwiChain shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use of the Service.
        </Text>

        <Text style={styles.sectionTitle}>7. Disclaimers</Text>
        <Text style={styles.paragraph}>
          The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
        </Text>

        <Text style={styles.sectionTitle}>8. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with applicable international laws, without regard to conflict of law provisions.
        </Text>

        <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of the Service after changes constitutes acceptance of the new terms.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms, contact us at support@pezkuwichain.io
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  updateDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
});