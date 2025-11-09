import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* ============================================
   PLACEHOLDER FOR DEVELOPMENT
   TODO: Implement Cloudflare Turnstile verification
   ============================================ */

export default function HumanVerificationScreen({ navigation }: any) {
  const handleContinue = () => {
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="shield-checkmark" size={80} color="#EE2A35" />
        
        <Text style={styles.title}>Human Verification</Text>
        <Text style={styles.subtitle}>Development Placeholder</Text>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue to Auth</Text>
        </TouchableOpacity>

        <Text style={styles.note}>🚧 Placeholder - Will be replaced with Turnstile</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#EE2A35',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
