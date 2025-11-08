import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.updateDate}>Last Updated: November 8, 2025</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us:
        </Text>
        <Text style={styles.bulletPoint}>• Account information (name, email, phone number)</Text>
        <Text style={styles.bulletPoint}>• Profile information (profile picture, preferences)</Text>
        <Text style={styles.bulletPoint}>• Wallet addresses (public blockchain addresses)</Text>
        <Text style={styles.bulletPoint}>• Transaction data (on public blockchain)</Text>
        <Text style={styles.bulletPoint}>• Device information (device type, OS version)</Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>We use collected information to:</Text>
        <Text style={styles.bulletPoint}>• Provide and maintain the Service</Text>
        <Text style={styles.bulletPoint}>• Process your transactions</Text>
        <Text style={styles.bulletPoint}>• Send you notifications and updates</Text>
        <Text style={styles.bulletPoint}>• Improve our services and user experience</Text>
        <Text style={styles.bulletPoint}>• Detect and prevent fraud or security issues</Text>
        <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>

        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell or rent your personal information. We may share information:
        </Text>
        <Text style={styles.bulletPoint}>• With your consent</Text>
        <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
        <Text style={styles.bulletPoint}>• With service providers who assist us</Text>
        <Text style={styles.bulletPoint}>• In case of merger, sale, or business transfer</Text>

        <Text style={styles.sectionTitle}>4. Blockchain Transparency</Text>
        <Text style={styles.paragraph}>
          Transactions on blockchain networks are publicly visible. Your wallet address and transaction history may be viewed by anyone on the blockchain network.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard security measures to protect your information:
        </Text>
        <Text style={styles.bulletPoint}>• Encryption of sensitive data</Text>
        <Text style={styles.bulletPoint}>• Secure authentication protocols</Text>
        <Text style={styles.bulletPoint}>• Regular security audits</Text>
        <Text style={styles.bulletPoint}>• Biometric authentication options</Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.paragraph}>You have the right to:</Text>
        <Text style={styles.bulletPoint}>• Access your personal information</Text>
        <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
        <Text style={styles.bulletPoint}>• Delete your account and data</Text>
        <Text style={styles.bulletPoint}>• Export your data</Text>
        <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>

        <Text style={styles.sectionTitle}>7. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.
        </Text>

        <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          Our Service is not intended for users under 18 years of age. We do not knowingly collect information from children under 18.
        </Text>

        <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
        <Text style={styles.paragraph}>
          Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. We will notify you of any material changes via email or in-app notification.
        </Text>

        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          For privacy-related questions or requests, contact us at:
        </Text>
        <Text style={styles.bulletPoint}>• Email: privacy@pezkuwichain.io</Text>
        <Text style={styles.bulletPoint}>• Support: support@pezkuwichain.io</Text>
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