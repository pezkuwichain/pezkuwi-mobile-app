import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePolkadot } from '../../contexts/PolkadotContext';

export default function CreateWalletScreen({ navigation }: any) {
  const { createWallet, isLoading } = usePolkadot();
  
  const [walletName, setWalletName] = useState('My Wallet');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'form' | 'seed'>('form');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [seedConfirmed, setSeedConfirmed] = useState(false);

  const handleCreateWallet = async () => {
    // Validations
    if (!walletName.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Create wallet
    const result = await createWallet(walletName, password);

    if (result.success && result.mnemonic) {
      setSeedPhrase(result.mnemonic);
      setStep('seed');
    } else {
      Alert.alert('Error', result.error || 'Failed to create wallet');
    }
  };

  const handleCopySeed = () => {
    Clipboard.setString(seedPhrase);
    Alert.alert('Copied!', 'Seed phrase copied to clipboard');
  };

  const handleComplete = () => {
    if (!seedConfirmed) {
      Alert.alert(
        'Important!',
        'Please confirm that you have backed up your seed phrase. You will need it to recover your wallet.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'I Have Backed It Up',
            onPress: () => {
              setSeedConfirmed(true);
              navigation.navigate('MainTabs');
            },
          },
        ]
      );
    } else {
      navigation.navigate('MainTabs');
    }
  };

  if (step === 'seed') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#F08080', '#E8C896']}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Ionicons name="key" size={60} color="#FFF" />
              <Text style={styles.title}>Your Seed Phrase</Text>
              <Text style={styles.subtitle}>
                Write down these 12 words in order. Keep them safe and secret.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.warningBanner}>
                <Ionicons name="warning" size={24} color="#FF6B6B" />
                <Text style={styles.warningText}>
                  Never share your seed phrase with anyone!
                </Text>
              </View>

              <View style={styles.seedContainer}>
                {seedPhrase.split(' ').map((word, index) => (
                  <View key={index} style={styles.seedWord}>
                    <Text style={styles.seedNumber}>{index + 1}.</Text>
                    <Text style={styles.seedText}>{word}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopySeed}
              >
                <Ionicons name="copy" size={20} color="#FFF" />
                <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSeedConfirmed(!seedConfirmed)}
              >
                {seedConfirmed && (
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I have written down my seed phrase in a safe place
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !seedConfirmed && styles.continueButtonDisabled,
              ]}
              onPress={handleComplete}
              disabled={!seedConfirmed}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F08080', '#E8C896']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Ionicons name="add-circle" size={60} color="#FFF" />
            <Text style={styles.title}>Create New Wallet</Text>
            <Text style={styles.subtitle}>
              Set up your new PezkuwiChain wallet
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter wallet name"
                value={walletName}
                onChangeText={setWalletName}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.createButtonText}>Create Wallet</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#F08080',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  warningBanner: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  seedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  seedWord: {
    width: '30%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seedNumber: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  seedText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#7DD3C0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
  },
  continueButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#F08080',
    fontSize: 18,
    fontWeight: '700',
  },
});
