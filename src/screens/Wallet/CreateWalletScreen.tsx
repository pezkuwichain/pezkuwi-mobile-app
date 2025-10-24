import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as bip39 from 'bip39';
import Colors from '../../constants/colors';

export default function CreateWalletScreen({ navigation }: any) {
  const [step, setStep] = useState<'generate' | 'verify' | 'password'>(
    'generate'
  );
  const [mnemonic, setMnemonic] = useState<string>('');
  const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    generateMnemonic();
  }, []);

  const generateMnemonic = () => {
    // Generate 12-word mnemonic using BIP39
    const newMnemonic = bip39.generateMnemonic(128); // 128 bits = 12 words
    setMnemonic(newMnemonic);
    const words = newMnemonic.split(' ');
    setMnemonicWords(words);
  };

  const copyToClipboard = () => {
    Clipboard.setString(mnemonic);
    Alert.alert('Copied!', 'Recovery phrase copied to clipboard');
  };

  const proceedToVerification = () => {
    // Shuffle words for verification
    const shuffled = [...mnemonicWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setStep('verify');
  };

  const selectWord = (word: string, index: number) => {
    if (selectedWords.length < mnemonicWords.length) {
      setSelectedWords([...selectedWords, index]);
    }
  };

  const removeWord = (index: number) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const verifyMnemonic = () => {
    const userMnemonic = selectedWords.map((i) => shuffledWords[i]).join(' ');
    if (userMnemonic === mnemonic) {
      Alert.alert(
        'Verified!',
        'Recovery phrase verified successfully',
        [
          {
            text: 'Continue',
            onPress: () => {
              // Skip password for now, go directly to wallet creation
              createWallet();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Verification Failed',
        'The words you selected do not match. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setSelectedWords([]);
            },
          },
        ]
      );
    }
  };

  const createWallet = async () => {
    try {
      // Import wallet service
      const WalletService = require('../../services/WalletService').default;
      
      // Create wallet from mnemonic
      await WalletService.createWallet(mnemonic);
      
      Alert.alert(
        'Success!',
        'Your wallet has been created successfully',
        [
          {
            text: 'Go to Wallet',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Wallet' }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
      console.error('Wallet creation error:', error);
    }
  };

  if (step === 'generate') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Wallet</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Warning Card */}
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={32} color={Colors.warning} />
            <Text style={styles.warningTitle}>
              Write Down Your Recovery Phrase
            </Text>
            <Text style={styles.warningText}>
              This is the ONLY way to recover your wallet. Store it somewhere safe
              and never share it with anyone.
            </Text>
          </View>

          {/* Mnemonic Display */}
          <View style={styles.mnemonicContainer}>
            <View style={styles.mnemonicHeader}>
              <Text style={styles.mnemonicTitle}>Your Recovery Phrase</Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}
              >
                <Ionicons name="copy-outline" size={20} color={Colors.primary} />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mnemonicGrid}>
              {mnemonicWords.map((word, index) => (
                <View key={index} style={styles.wordCard}>
                  <Text style={styles.wordNumber}>{index + 1}</Text>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Security Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Security Tips</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.tipText}>Write it down on paper</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.tipText}>Store in a secure location</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="close-circle" size={20} color={Colors.error} />
              <Text style={styles.tipText}>Never share with anyone</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="close-circle" size={20} color={Colors.error} />
              <Text style={styles.tipText}>Don't store digitally or online</Text>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={proceedToVerification}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>I've Written It Down</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'verify') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep('generate')}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Recovery Phrase</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
            <Text style={styles.instructionsTitle}>
              Select Words in Correct Order
            </Text>
            <Text style={styles.instructionsText}>
              Tap the words below in the same order as your recovery phrase to
              verify you've written it down correctly.
            </Text>
          </View>

          {/* Selected Words */}
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>
              Selected ({selectedWords.length}/{mnemonicWords.length})
            </Text>
            <View style={styles.selectedGrid}>
              {selectedWords.map((wordIndex, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedWord}
                  onPress={() => removeWord(index)}
                >
                  <Text style={styles.selectedWordNumber}>{index + 1}</Text>
                  <Text style={styles.selectedWordText}>
                    {shuffledWords[wordIndex]}
                  </Text>
                  <Ionicons name="close" size={16} color={Colors.error} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Word Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.optionsTitle}>Tap to Select</Text>
            <View style={styles.optionsGrid}>
              {shuffledWords.map((word, index) => {
                const isSelected = selectedWords.includes(index);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionWord,
                      isSelected && styles.optionWordDisabled,
                    ]}
                    onPress={() => selectWord(word, index)}
                    disabled={isSelected}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionWordText,
                        isSelected && styles.optionWordTextDisabled,
                      ]}
                    >
                      {word}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              selectedWords.length !== mnemonicWords.length &&
                styles.verifyButtonDisabled,
            ]}
            onPress={verifyMnemonic}
            disabled={selectedWords.length !== mnemonicWords.length}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>Verify & Create Wallet</Text>
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  warningCard: {
    backgroundColor: Colors.warning + '15',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.warning + '40',
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  mnemonicContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  mnemonicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mnemonicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
  },
  copyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  mnemonicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wordCard: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wordNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textGray,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    flex: 1,
  },
  tipsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textDark,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  instructionsCard: {
    backgroundColor: Colors.primary + '10',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 12,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textGray,
    marginBottom: 12,
  },
  selectedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 100,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
  },
  selectedWord: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  selectedWordNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  selectedWordText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  optionsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textGray,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionWord: {
    backgroundColor: Colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionWordDisabled: {
    backgroundColor: Colors.background,
    opacity: 0.4,
  },
  optionWordText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  optionWordTextDisabled: {
    color: Colors.textGray,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: Colors.textGray,
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

