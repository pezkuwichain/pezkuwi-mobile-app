import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

export default function WalletOnboardingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.coral]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="wallet" size={80} color="white" />
            </View>
            <Text style={styles.title}>PezkuwiChain Wallet</Text>
            <Text style={styles.subtitle}>
              Secure, decentralized wallet for Digital Kurdistan
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="white" />
              <Text style={styles.featureText}>Bank-level security</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="key" size={24} color="white" />
              <Text style={styles.featureText}>You control your keys</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="globe" size={24} color="white" />
              <Text style={styles.featureText}>Connected to PezkuwiChain</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('CreateWallet')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F0F0F0']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
                <Text style={styles.primaryButtonText}>Create New Wallet</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('ImportWallet')}
              activeOpacity={0.8}
            >
              <Ionicons name="download" size={24} color="white" />
              <Text style={styles.secondaryButtonText}>
                I Already Have a Wallet
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Notice */}
          <View style={styles.notice}>
            <Ionicons name="information-circle" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.noticeText}>
              Your wallet is secured with a 12-word recovery phrase. Keep it safe
              and never share it with anyone.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  features: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});

