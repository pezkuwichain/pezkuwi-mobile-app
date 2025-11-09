import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ku-sorani', name: 'Kurdish Sorani', nativeName: 'کوردی سۆرانی', flag: '🟥' },
  { code: 'ku-kurmanji', name: 'Kurdish Kurmanji', nativeName: 'Kurdî Kurmancî', flag: '🟨' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
];

export default function LanguageSettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentLanguage();
  }, []);

  const loadCurrentLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang) {
        setSelectedLanguage(savedLang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    setLoading(true);
    try {
      // Save to AsyncStorage and i18n
      await saveLanguage(languageCode);
      setSelectedLanguage(languageCode);

      // Save to backend
      if (user?.user_id) {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';
        fetch(`${backendUrl}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.user_id,
            language: languageCode,
          }),
        }).catch(err => console.error('Error saving language to backend:', err));
      }

      // FORCE APP RELOAD - this is the key fix
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }, 500);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Ionicons name="globe-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>
            6 languages fully supported. Other languages use Google Translator.
          </Text>
        </View>

        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedLanguage === language.code && { borderColor: colors.primary, backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => handleLanguageChange(language.code)}
            disabled={loading}
          >
            <View style={styles.languageCardLeft}>
              <Text style={styles.flag}>{language.flag}</Text>
              <View style={styles.languageInfo}>
                <Text style={[styles.languageName, { color: colors.text }]}>{language.name}</Text>
                <Text style={[styles.languageNative, { color: colors.textSecondary }]}>{language.nativeName}</Text>
              </View>
            </View>
            {selectedLanguage === language.code && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
            {loading && selectedLanguage === language.code && (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        ))}
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  languageCardSelected: {
    borderColor: '#EE2A35',
    backgroundColor: '#FEE2E2',
  },
  languageCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
    color: '#6B7280',
  },
});