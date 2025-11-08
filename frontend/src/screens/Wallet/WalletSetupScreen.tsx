import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePolkadot } from '../../contexts/PolkadotContext';

export default function WalletSetupScreen({ navigation }: any) {
  const { saveAccount } = usePolkadot();
  const [walletAddress, setWalletAddress] = useState('5DFwqK698vL4gXHEcanaewnAqhxJ2rjhAogpSTHw3iwGDwd3');
  const [walletName, setWalletName] = useState('My Wallet');

  const handleConnectWithAddress = async () => {
    if (!walletAddress.trim()) {
      Alert.alert('Error', 'Please enter a valid wallet address');
      return;
    }

    // Save the account
    await saveAccount({
      address: walletAddress.trim(),
      name: walletName.trim() || 'My Wallet',
    });

    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F08080', '#E8C896', '#F5B895']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="wallet" size={80} color="#FFF" />
            <Text style={styles.title}>Connect Your Wallet</Text>
            <Text style={styles.subtitle}>
              Enter your PezkuwiChain wallet address to get started
            </Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <View style={styles.optionHeader}>
              <Ionicons name="key" size={32} color="#F08080" />
              <Text style={styles.optionTitle}>Wallet Details</Text>
            </View>
            
            <Text style={styles.label}>Wallet Name (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="My Wallet"
              value={walletName}
              onChangeText={setWalletName}
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Wallet Address</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="5GrwvaEF5zXb26Fz9rcQpDWS..."
              value={walletAddress}
              onChangeText={setWalletAddress}
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              numberOfLines={2}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleConnectWithAddress}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#7DD3C0" />
              <Text style={styles.infoText}>
                Your wallet address is only stored locally on your device. We never access your private keys.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={20} color="#FFF" />
            <Text style={styles.footerText}>
              All blockchain data fetched securely via backend API
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
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#333',
  },
  addressInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#F08080',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F0F9F7',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D0F0E8',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#5DBEA3',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
  },
});
