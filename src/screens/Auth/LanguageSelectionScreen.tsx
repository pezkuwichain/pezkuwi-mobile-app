import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import i18n from '../../i18n';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî (Kurmancî)' },
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی (سۆرانی)' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
];

export default function LanguageSelectionScreen({ navigation }: any) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const handleContinue = () => {
    // Save language preference and change i18n language
    i18n.changeLanguage(selectedLanguage);
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#F08080', '#F5B895', '#E8C896']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.brandName}>PezkuwiChain</Text>
            <Text style={styles.subtitle}>Your Digital Citizenship Platform</Text>
            <Text style={styles.description}>
              Building the future of Kurdish digital infrastructure
            </Text>
          </View>

          {/* Language Selection */}
          <View style={styles.languageSection}>
            <Text style={styles.sectionTitle}>Select Your Language</Text>
            
            <View style={styles.languageGrid}>
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageButton,
                    selectedLanguage === language.code && styles.languageButtonSelected,
                  ]}
                  onPress={() => setSelectedLanguage(language.code)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.languageText,
                      selectedLanguage === language.code && styles.languageTextSelected,
                    ]}
                  >
                    {language.nativeName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Get Started →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.coral,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  brandName: {
    fontSize: Typography.sizes.display,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.sizes.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  languageSection: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  languageButton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.large,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#FFFFFF',
  },
  languageText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  languageTextSelected: {
    color: Colors.coral,
    fontWeight: Typography.weights.semibold,
  },
  continueButton: {
    backgroundColor: 'rgba(212, 160, 23, 0.9)',
    borderRadius: BorderRadius.xxlarge,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
});

