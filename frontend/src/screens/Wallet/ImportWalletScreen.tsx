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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePolkadot } from '../../contexts/PolkadotContext';

export default function ImportWalletScreen({ navigation }: any) {
  const { importWallet, isLoading } = usePolkadot();
  
  const [walletName, setWalletName] = useState('Imported Wallet');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleImportWallet = async () => {
    // Validations
    if (!walletName.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    const trimmedSeed = seedPhrase.trim();
    const wordCount = trimmedSeed.split(/\s+/).length;
    
    if (wordCount !== 12 && wordCount !== 24) {
      Alert.alert('Error', 'Seed phrase must be 12 or 24 words');
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

    // Import wallet
    const result = await importWallet(trimmedSeed, walletName, password);

    if (result.success) {
      Alert.alert(
        'Success!',
        'Wallet imported successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to import wallet');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#7DD3C0', '#98D8C8']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Ionicons name="download" size={60} color="#FFF" />
            <Text style={styles.title}>Import Wallet</Text>
            <Text style={styles.subtitle}>
              Restore your wallet using your seed phrase
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
              <Text style={styles.label}>Seed Phrase (12 or 24 words)</Text>
              <TextInput
                style={[styles.input, styles.seedInput]}
                placeholder="Enter your seed phrase separated by spaces"
                value={seedPhrase}
                onChangeText={setSeedPhrase}
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.hint}>
                Separate each word with a space
              </Text>
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

            <View style={styles.warningBox}>
              <Ionicons name="information-circle" size={24} color="#7DD3C0" />
              <Text style={styles.warningText}>
                Make sure you're in a safe place. Never share your seed phrase with anyone.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.importButton}
              onPress={handleImportWallet}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.importButtonText}>Import Wallet</Text>
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
  seedInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  warningBox: {
    backgroundColor: '#F0F9F7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D0F0E8',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#5DBEA3',
    lineHeight: 20,
  },
  importButton: {
    backgroundColor: '#7DD3C0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  importButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
