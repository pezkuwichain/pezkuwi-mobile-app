import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';

interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
}

export default function ProfileScreen({ navigation }: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const accountMenuItems: MenuItem[] = [
    {
      id: 'edit-profile',
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => Alert.alert('Edit Profile', 'Coming soon'),
      showArrow: true,
    },
    {
      id: 'identity',
      icon: 'card-outline',
      title: 'Digital Identity',
      subtitle: 'View your Kurdistan Citizen Card',
      onPress: () => navigation.navigate('Identity'),
      showArrow: true,
    },
    {
      id: 'trust-score',
      icon: 'star-outline',
      title: 'Trust Score',
      subtitle: '750 points',
      onPress: () => navigation.navigate('TrustScore'),
      showArrow: true,
    },
  ];

  const securityMenuItems: MenuItem[] = [
    {
      id: 'change-password',
      icon: 'lock-closed-outline',
      title: 'Change Password',
      onPress: () => Alert.alert('Change Password', 'Coming soon'),
      showArrow: true,
    },
    {
      id: 'biometric',
      icon: 'finger-print-outline',
      title: 'Biometric Authentication',
      onPress: () => {},
      showSwitch: true,
      switchValue: biometricEnabled,
    },
    {
      id: 'backup',
      icon: 'cloud-upload-outline',
      title: 'Backup Wallet',
      subtitle: 'Secure your recovery phrase',
      onPress: () => Alert.alert('Backup Wallet', 'This feature will help you backup your wallet securely.'),
      showArrow: true,
    },
  ];

  const preferencesMenuItems: MenuItem[] = [
    {
      id: 'notifications',
      icon: 'notifications-outline',
      title: 'Push Notifications',
      onPress: () => {},
      showSwitch: true,
      switchValue: notificationsEnabled,
    },
    {
      id: 'language',
      icon: 'language-outline',
      title: 'Language',
      subtitle: 'English',
      onPress: () => navigation.navigate('LanguageSelection'),
      showArrow: true,
    },
    {
      id: 'currency',
      icon: 'cash-outline',
      title: 'Currency',
      subtitle: 'USD',
      onPress: () => Alert.alert('Currency', 'Currency selection coming soon'),
      showArrow: true,
    },
  ];

  const supportMenuItems: MenuItem[] = [
    {
      id: 'help',
      icon: 'help-circle-outline',
      title: 'Help Center',
      onPress: () => Alert.alert('Help Center', 'Visit help.pezkuwichain.io'),
      showArrow: true,
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      title: 'About PezkuwiChain',
      subtitle: 'Version 1.0.0',
      onPress: () => Alert.alert('About', 'PezkuwiChain v1.0.0\nBuilding the future of Kurdish digital infrastructure'),
      showArrow: true,
    },
    {
      id: 'terms',
      icon: 'document-text-outline',
      title: 'Terms & Privacy',
      onPress: () => Alert.alert('Terms', 'View terms and privacy policy'),
      showArrow: true,
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('LanguageSelection'),
        },
      ]
    );
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        <Ionicons name={item.icon} size={24} color={Colors.teal} />
      </View>

      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.menuSubtitle}>{item.subtitle}</Text>}
      </View>

      {item.showArrow && (
        <Ionicons name="chevron-forward" size={20} color={Colors.textGray} />
      )}

      {item.showSwitch && (
        <Switch
          value={item.switchValue}
          onValueChange={(value) => {
            if (item.id === 'notifications') {
              setNotificationsEnabled(value);
            } else if (item.id === 'biometric') {
              setBiometricEnabled(value);
            }
          }}
          trackColor={{ false: '#D0D0D0', true: Colors.teal }}
          thumbColor="#FFFFFF"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={Colors.gradients.header}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>Satoshi Qazi Muhammed</Text>
              <Text style={styles.userEmail}>satoshi@pezkuwichain.io</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => Alert.alert('Edit Profile', 'Coming soon')}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>750</Text>
              <Text style={styles.statLabel}>Trust Score</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Referrals</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Certificates</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {accountMenuItems.map(renderMenuItem)}
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          {securityMenuItems.map(renderMenuItem)}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {preferencesMenuItems.map(renderMenuItem)}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {supportMenuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.coral} />
          <Text style={styles.logoutText}>Logout</Text>
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xxlarge,
    borderBottomRightRadius: BorderRadius.xxlarge,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  userName: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.sizes.small,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.large,
    padding: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.sizes.small,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: Spacing.md,
  },
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.textGray,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.sm,
    ...Shadow.small,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.teal + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.medium,
    color: Colors.textDark,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.coral + '20',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xxxl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.coral,
  },
});

