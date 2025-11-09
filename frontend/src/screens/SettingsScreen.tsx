import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import i18n from '../config/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const LANGUAGE_NAMES: { [key: string]: string } = {
  'en': 'English',
  'ku-sorani': 'کوردی سۆرانی',
  'ku-kurmanji': 'Kurdî Kurmancî',
  'ar': 'العربية',
  'tr': 'Türkçe',
  'fa': 'فارسی',
};

export default function SettingsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricAvailable, setBiometricAvailable] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricSetting();
    loadCurrentLanguage();
  }, []);

  useEffect(() => {
    // Reload language when screen gains focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadCurrentLanguage();
    });
    return unsubscribe;
  }, [navigation]);

  const loadCurrentLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      const langName = savedLang ? LANGUAGE_NAMES[savedLang] || 'English' : 'English';
      setCurrentLanguage(langName);
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const loadBiometricSetting = async () => {
    const enabled = await SecureStore.getItemAsync('biometricEnabled');
    setBiometricsEnabled(enabled === 'true');
  };

  const toggleBiometrics = async (value: boolean) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometrics',
      });
      
      if (result.success) {
        await SecureStore.setItemAsync('biometricEnabled', 'true');
        setBiometricsEnabled(true);
        Alert.alert('Success', 'Biometric authentication enabled');
      } else {
        Alert.alert('Failed', 'Biometric authentication failed');
      }
    } else {
      await SecureStore.setItemAsync('biometricEnabled', 'false');
      setBiometricsEnabled(false);
      Alert.alert('Success', 'Biometric authentication disabled');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigation.replace('Language');
  };

  const SettingSection = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement }: any) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.card }]} 
      onPress={onPress} 
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingItemContent}>
          <Text style={[styles.settingItemTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingItemSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{i18n.t('settings')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <SettingSection title={i18n.t('profile')}>
          <SettingItem
            icon="person"
            title={i18n.t('editProfile')}
            subtitle={user?.email || 'Update your information'}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingItem
            icon="wallet"
            title={i18n.t('walletAddress')}
            subtitle="5GgTgG9sRm...ioki45"
            onPress={() => navigation.navigate('WalletAddress')}
          />
        </SettingSection>

        {/* Security Section */}
        <SettingSection title={i18n.t('security')}>
          <SettingItem
            icon="finger-print"
            title={i18n.t('biometricAuth')}
            subtitle={biometricAvailable ? 'Use fingerprint or Face ID' : 'Not available on this device'}
            rightElement={
              biometricAvailable ? (
                <Switch
                  value={biometricsEnabled}
                  onValueChange={toggleBiometrics}
                  trackColor={{ false: '#E5E7EB', true: '#EE2A3580' }}
                  thumbColor={biometricsEnabled ? '#EE2A35' : '#F3F4F6'}
                />
              ) : undefined
            }
          />
          <SettingItem
            icon="key"
            title={i18n.t('changePassword')}
            subtitle="Update your password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <SettingItem
            icon="shield-checkmark"
            title={i18n.t('twoFactorAuth')}
            subtitle="Add extra security"
            onPress={() => Alert.alert('Coming Soon', '2FA feature will be available in the next update')}
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive alerts and updates"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: '#EE2A3580' }}
                thumbColor={notificationsEnabled ? '#EE2A35' : '#F3F4F6'}
              />
            }
          />
          <SettingItem
            icon="language"
            title="Language"
            subtitle={currentLanguage}
            onPress={() => navigation.navigate('LanguageSettings')}
          />
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle={isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
            rightElement={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E5E7EB', true: '#EE2A3580' }}
                thumbColor={isDarkMode ? '#EE2A35' : '#F3F4F6'}
              />
            }
          />
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <SettingItem icon="information-circle" title="Version" subtitle="1.0.0" />
          <SettingItem icon="document-text" title="Terms of Service" onPress={() => navigation.navigate('Terms')} />
          <SettingItem icon="shield" title="Privacy Policy" onPress={() => navigation.navigate('Privacy')} />
          <SettingItem icon="help-circle" title="Help & Support" onPress={() => navigation.navigate('Help')} />
        </SettingSection>

        {/* Sign Out */}
        <TouchableOpacity 
          style={[styles.signOutButton, { backgroundColor: colors.error + '20' }]} 
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
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
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});
