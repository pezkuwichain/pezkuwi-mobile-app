import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as bip39 from 'bip39';
import Colors from '../../constants/colors';

export default function ImportWalletScreen({ navigation }: any) {
  const [mnemonic, setMnemonic] = useState('');
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  );
  const [importMethod, setImportMethod] = useState<'phrase' | 'words'>('phrase');

  const handlePhraseChange = (text: string) => {
    setMnemonic(text.trim().toLowerCase());
  };

  const handleWordChange = (index: number, text: string) => {
    const newWords = [...mnemonicWords];
    newWords[index] = text.trim().toLowerCase();
    setMnemonicWords(newWords);
  };

  const validateAndImport = async () => {
    let phraseToValidate = '';
    
    if (importMethod === 'phrase') {
      phraseToValidate = mnemonic;
    } else {
      phraseToValidate = mnemonicWords.join(' ');
    }

    // Validate mnemonic
    if (!bip39.validateMnemonic(phraseToValidate)) {
      Alert.alert(
        'Invalid Recovery Phrase',
        'The recovery phrase you entered is not valid. Please check and try again.'
      );
      return;
    }

    try {
      // Import wallet service
      const WalletService = require('../../services/WalletService').default;
      
      // Import wallet from mnemonic
      await WalletService.createWallet(phraseToValidate);
      
      Alert.alert(
        'Success!',
        'Your wallet has been imported successfully',
        [
          {
            text: 'Go to Wallet',
            onPress: () => navigation.navigate('MainTabs', { screen: 'Wallet' }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to import wallet. Please try again.');
      console.error('Wallet import error:', error);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const { Clipboard } = require('react-native');
      const text = await Clipboard.getString();
      if (text) {
        setMnemonic(text.trim().toLowerCase());
        setImportMethod('phrase');
      }
    } catch (error) {
      console.error('Paste error:', error);
    }
  };

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
          <Text style={styles.headerTitle}>Import Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={32} color={Colors.primary} />
          <Text style={styles.infoTitle}>Import Your Wallet</Text>
          <Text style={styles.infoText}>
            Enter your 12-word recovery phrase to restore your wallet. Make sure
            you're in a safe place and no one is watching.
          </Text>
        </View>

        {/* Import Method Selector */}
        <View style={styles.methodSelector}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              importMethod === 'phrase' && styles.methodButtonActive,
            ]}
            onPress={() => setImportMethod('phrase')}
          >
            <Text
              style={[
                styles.methodButtonText,
                importMethod === 'phrase' && styles.methodButtonTextActive,
              ]}
            >
              Full Phrase
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              importMethod === 'words' && styles.methodButtonActive,
            ]}
            onPress={() => setImportMethod('words')}
          >
            <Text
              style={[
                styles.methodButtonText,
                importMethod === 'words' && styles.methodButtonTextActive,
              ]}
            >
              Word by Word
            </Text>
          </TouchableOpacity>
        </View>

        {/* Import Input */}
        {importMethod === 'phrase' ? (
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Recovery Phrase</Text>
              <TouchableOpacity
                style={styles.pasteButton}
                onPress={pasteFromClipboard}
              >
                <Ionicons name="clipboard-outline" size={18} color={Colors.primary} />
                <Text style={styles.pasteText}>Paste</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.phraseInput}
              placeholder="Enter your 12-word recovery phrase separated by spaces"
              placeholderTextColor={Colors.textGray}
              value={mnemonic}
              onChangeText={handlePhraseChange}
              multiline
              numberOfLines={4}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.wordCount}>
              {mnemonic.split(' ').filter((w) => w.length > 0).length} / 12 words
            </Text>
          </View>
        ) : (
          <View style={styles.wordsContainer}>
            <Text style={styles.wordsTitle}>Enter Each Word</Text>
            <View style={styles.wordsGrid}>
              {mnemonicWords.map((word, index) => (
                <View key={index} style={styles.wordInputContainer}>
                  <Text style={styles.wordNumber}>{index + 1}</Text>
                  <TextInput
                    style={styles.wordInput}
                    placeholder={`Word ${index + 1}`}
                    placeholderTextColor={Colors.textGray}
                    value={word}
                    onChangeText={(text) => handleWordChange(index, text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Security Warning */}
        <View style={styles.warningCard}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.warning} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Security Reminder</Text>
            <Text style={styles.warningText}>
              • Never share your recovery phrase{'\n'}
              • PezkuwiChain will never ask for it{'\n'}
              • Beware of phishing attempts{'\n'}
              • Make sure you're using the official app
            </Text>
          </View>
        </View>

        {/* Import Button */}
        <TouchableOpacity
          style={styles.importButton}
          onPress={validateAndImport}
          activeOpacity={0.8}
        >
          <Text style={styles.importButtonText}>Import Wallet</Text>
          <Ionicons name="download" size={20} color="white" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
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
  infoCard: {
    backgroundColor: Colors.primary + '10',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  methodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: Colors.primary,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textGray,
  },
  methodButtonTextActive: {
    color: 'white',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
  },
  pasteText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  phraseInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: Colors.textDark,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  wordCount: {
    fontSize: 12,
    color: Colors.textGray,
    marginTop: 8,
    textAlign: 'right',
  },
  wordsContainer: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  wordsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 16,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wordInputContainer: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  wordNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textGray,
  },
  wordInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textDark,
    padding: 0,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warning + '10',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 6,
  },
  warningText: {
    fontSize: 12,
    color: Colors.textDark,
    lineHeight: 18,
  },
  importButton: {
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
  importButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

