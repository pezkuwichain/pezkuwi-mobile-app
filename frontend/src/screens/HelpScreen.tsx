import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I create a wallet?',
      answer: 'When you sign up for PezkuwiChain, a wallet is automatically created for you. Your wallet address is displayed in the Settings > Profile section.',
    },
    {
      id: '2',
      question: 'How do I send tokens?',
      answer: 'Go to the Wallet tab, tap on the token you want to send (HEZ or PEZ), then tap the "Send" button. Enter the recipient\'s wallet address and the amount you want to send.',
    },
    {
      id: '3',
      question: 'What is the difference between HEZ and PEZ?',
      answer: 'HEZ (Hemwelatî) is the citizenship token used for identity verification and governance. PEZ (Pezkuwî) is the utility token used for transactions and services within the ecosystem.',
    },
    {
      id: '4',
      question: 'How do I participate in governance?',
      answer: 'Navigate to the Vote section from quick actions or wallet. You can view active proposals and vote using your HEZ tokens. Each HEZ token represents one vote.',
    },
    {
      id: '5',
      question: 'Is my wallet secure?',
      answer: 'Yes! We use industry-standard encryption and security measures. You can also enable biometric authentication and 2FA for additional security. Remember to never share your password or recovery phrase.',
    },
    {
      id: '6',
      question: 'How do I recover my account?',
      answer: 'If you forget your password, use the "Forgot Password" option on the login screen. For account recovery issues, contact our support team at support@pezkuwichain.io',
    },
    {
      id: '7',
      question: 'What are transaction fees?',
      answer: 'Network fees (gas fees) are required for blockchain transactions. These fees go to validators who process and secure transactions on the network.',
    },
    {
      id: '8',
      question: 'How long do transactions take?',
      answer: 'Most transactions are confirmed within seconds to a few minutes, depending on network congestion. You can view transaction status in your transaction history.',
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openSupport = () => {
    Linking.openURL('https://pezkuwichain.io/support');
  };

  const sendEmail = () => {
    Linking.openURL('mailto:support@pezkuwichain.io');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Support Options */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <TouchableOpacity style={styles.supportCard} onPress={openSupport}>
            <View style={styles.supportCardLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="globe" size={24} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.supportCardTitle}>Visit Support Center</Text>
                <Text style={styles.supportCardSubtitle}>pezkuwichain.io/support</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportCard} onPress={sendEmail}>
            <View style={styles.supportCardLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="mail" size={24} color="#EE2A35" />
              </View>
              <View>
                <Text style={styles.supportCardTitle}>Email Support</Text>
                <Text style={styles.supportCardSubtitle}>support@pezkuwichain.io</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => toggleExpand(faq.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6B7280"
                />
              </View>
              {expandedId === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>App Version 1.0.0</Text>
          <Text style={styles.infoText}>© 2025 PezkuwiChain. All rights reserved.</Text>
        </View>
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
    padding: 16,
    paddingBottom: 80,
  },
  supportSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  supportCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supportCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  supportCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});
