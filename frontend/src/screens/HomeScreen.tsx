import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

function HomeTab() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfileImage(base64Image);
      // TODO: Save to backend
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.profileImage} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImageSrc} />
              ) : (
                <Ionicons name="person" size={24} color="#6B7280" />
              )}
            </TouchableOpacity>
            <View style={styles.profileBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.trustScore}>750</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="qr-code-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Announcements Widget */}
        <View style={styles.announcementWidget}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.announcement}>
              <Text style={styles.announcementTitle}>🎉 Welcome to PezkuwiChain!</Text>
              <Text style={styles.announcementText}>Start your citizenship journey today</Text>
            </View>
            <View style={styles.announcement}>
              <Text style={styles.announcementTitle}>📢 New Feature</Text>
              <Text style={styles.announcementText}>Vote on governance proposals</Text>
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions Grid - 30 Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WalletTab() {
  const { user } = useAuth();
  const [hezBalance, setHezBalance] = useState('Loading...');
  const [pezBalance, setPezBalance] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  const TEST_WALLET = '5GgTgG9sRmPQAYU1RsTejZYnZRjwzKZKWD3awtuqjHioki45';

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/blockchain/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: TEST_WALLET,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHezBalance(parseFloat(data.hez).toFixed(2));
        setPezBalance(parseFloat(data.pez).toFixed(2));
      } else {
        setHezBalance('Error');
        setPezBalance('Error');
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
      setHezBalance('Error');
      setPezBalance('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>My Wallet</Text>
          <TouchableOpacity onPress={fetchBalance} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#EE2A35" />
          </TouchableOpacity>
        </View>
        
        {/* Balance Cards */}
        <View style={styles.balanceCards}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceCardHeader}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_mobile-wallet-app-3/artifacts/izidxcrq_hez_logo_kurdistangunesi.png' }}
                style={styles.tokenLogo}
              />
              <Text style={styles.tokenSymbol}>HEZ</Text>
            </View>
            <Text style={styles.balanceAmount}>{hezBalance}</Text>
            <Text style={styles.balanceUsd}>Hemwelatî Token</Text>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceCardHeader}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_mobile-wallet-app-3/artifacts/jjj4s5p3_pez_logo.jpg' }}
                style={styles.tokenLogo}
              />
              <Text style={styles.tokenSymbol}>PEZ</Text>
            </View>
            <Text style={styles.balanceAmount}>{pezBalance}</Text>
            <Text style={styles.balanceUsd}>Pezkuwî Token</Text>
          </View>
        </View>

        {/* Wallet Actions */}
        <View style={styles.walletActions}>
          <TouchableOpacity style={styles.walletActionButton}>
            <Ionicons name="arrow-up" size={24} color="#FFF" />
            <Text style={styles.walletActionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletActionButton}>
            <Ionicons name="arrow-down" size={24} color="#FFF" />
            <Text style={styles.walletActionText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletActionButton}>
            <Ionicons name="swap-horizontal" size={24} color="#FFF" />
            <Text style={styles.walletActionText}>Swap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CitizensTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>Citizens Screen</Text>
    </View>
  );
}

function ReferralTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>Referral Screen</Text>
    </View>
  );
}

function ProfileTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>Profile Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EE2A35',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletTab}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Citizens"
        component={CitizensTab}
        options={{
          tabBarLabel: 'Citizens',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Referral"
        component={ReferralTab}
        options={{
          tabBarLabel: 'Referral',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const QUICK_ACTIONS = [
  { id: '1', label: 'Send', icon: 'arrow-forward', color: '#EE2A35' },
  { id: '2', label: 'Receive', icon: 'arrow-down', color: '#00A651' },
  { id: '3', label: 'Swap', icon: 'swap-horizontal', color: '#FFD700' },
  { id: '4', label: 'Vote', icon: 'checkmark-circle', color: '#3B82F6' },
  { id: '5', label: 'Stake', icon: 'lock-closed', color: '#8B5CF6' },
  { id: '6', label: 'Identity', icon: 'card', color: '#10B981' },
  { id: '7', label: 'Passport', icon: 'document-text', color: '#F59E0B' },
  { id: '8', label: 'Education', icon: 'school', color: '#EC4899' },
  { id: '9', label: 'Business', icon: 'briefcase', color: '#6366F1' },
  { id: '10', label: 'Treasury', icon: 'cash', color: '#14B8A6' },
  { id: '11', label: 'Proposals', icon: 'bulb', color: '#F97316' },
  { id: '12', label: 'History', icon: 'time', color: '#84CC16' },
  { id: '13', label: 'QR Scan', icon: 'qr-code', color: '#06B6D4' },
  { id: '14', label: 'Settings', icon: 'settings', color: '#64748B' },
  { id: '15', label: 'Help', icon: 'help-circle', color: '#A855F7' },
  { id: '16', label: 'Rewards', icon: 'star', color: '#FBBF24' },
  { id: '17', label: 'Trust', icon: 'heart', color: '#EF4444' },
  { id: '18', label: 'Parliament', icon: 'flag', color: '#3B82F6' },
  { id: '19', label: 'Ministry', icon: 'business', color: '#10B981' },
  { id: '20', label: 'Justice', icon: 'hammer', color: '#78350F' },
  { id: '21', label: 'Tax', icon: 'receipt', color: '#991B1B' },
  { id: '22', label: 'Census', icon: 'people-circle', color: '#1E40AF' },
  { id: '23', label: 'Land', icon: 'map', color: '#065F46' },
  { id: '24', label: 'Marriage', icon: 'heart-circle', color: '#BE185D' },
  { id: '25', label: 'Birth', icon: 'happy', color: '#7C3AED' },
  { id: '26', label: 'Death', icon: 'sad', color: '#404040' },
  { id: '27', label: 'Trade', icon: 'storefront', color: '#0891B2' },
  { id: '28', label: 'Export', icon: 'airplane', color: '#4338CA' },
  { id: '29', label: 'Import', icon: 'boat', color: '#15803D' },
  { id: '30', label: 'More', icon: 'apps', color: '#9333EA' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImageSrc: {
    width: 50,
    height: 50,
  },
  profileBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trustScore: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  announcementWidget: {
    padding: 16,
  },
  announcement: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: width - 64,
    borderLeftWidth: 4,
    borderLeftColor: '#EE2A35',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  announcementText: {
    fontSize: 14,
    color: '#6B7280',
  },
  quickActionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 64) / 4,
    alignItems: 'center',
    padding: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
  },
  walletHeader: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  balanceCards: {
    padding: 16,
    gap: 12,
  },
  balanceCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tokenLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 16,
    color: '#6B7280',
  },
  walletActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  walletActionButton: {
    flex: 1,
    backgroundColor: '#EE2A35',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  walletActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#6B7280',
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 8,
    height: 65,
  },
});
