import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '../config/i18n';

const { width } = Dimensions.get('window');

function HomeTab({ navigation }: any) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const showImagePickerOptions = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImageFromGallery,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
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

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Gallery access is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.profileImage} onPress={showImagePickerOptions}>
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
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('QRScanner')}>
              <Ionicons name="qr-code-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
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
          <Text style={styles.sectionTitle}>{i18n.t('quickActions')}</Text>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, 
                  (index % 4 === 0) && styles.actionCardFirst,
                  (index % 4 === 3) && styles.actionCardLast
                ]}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{i18n.t(action.labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function WalletTab() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout
      
      const response = await fetch(`${backendUrl}/api/blockchain/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: TEST_WALLET,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setHezBalance(parseFloat(data.hez).toFixed(2));
        setPezBalance(parseFloat(data.pez).toFixed(2));
      } else {
        setHezBalance('0.00');
        setPezBalance('0.00');
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
      setHezBalance('0.00');
      setPezBalance('0.00');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.walletScrollContent}>
        {/* Header */}
        <View style={[styles.walletHeader, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.walletTitle}>My Wallet</Text>
          <TouchableOpacity onPress={fetchBalance} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#EE2A35" />
          </TouchableOpacity>
        </View>
        
        {/* Balance Cards - Side by Side */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceCardNew}>
            <Image
              source={{ uri: 'https://customer-assets.emergentagent.com/job_mobile-wallet-app-3/artifacts/izidxcrq_hez_logo_kurdistangunesi.png' }}
              style={styles.tokenLogoNew}
            />
            <Text style={styles.tokenSymbolNew}>HEZ</Text>
            <Text style={styles.balanceAmountNew}>{hezBalance}</Text>
            <Text style={styles.tokenNameNew}>Hemwelatî Token</Text>
          </View>

          <View style={styles.balanceCardNew}>
            <Image
              source={{ uri: 'https://customer-assets.emergentagent.com/job_mobile-wallet-app-3/artifacts/jjj4s5p3_pez_logo.jpg' }}
              style={styles.tokenLogoNew}
            />
            <Text style={styles.tokenSymbolNew}>PEZ</Text>
            <Text style={styles.balanceAmountNew}>{pezBalance}</Text>
            <Text style={styles.tokenNameNew}>Pezkuwî Token</Text>
          </View>
        </View>

        {/* Action Buttons Container */}
        <View style={styles.actionsContainer}>
          {/* First Row: Send, Receive, Swap, P2P */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#34D399'}]}>
              <Ionicons name="arrow-up" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#3B82F6'}]}>
              <Ionicons name="arrow-down" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#8B5CF6'}]}>
              <Ionicons name="swap-horizontal" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Swap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#1F2937'}]}>
              <Ionicons name="people" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>P2P</Text>
            </TouchableOpacity>
          </View>

          {/* Second Row: Vote, DApps, Staking, Connect */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#EF4444'}]}>
              <Ionicons name="megaphone" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Vote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#F59E0B'}]}>
              <Ionicons name="apps" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>DApps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#10B981'}]}>
              <Ionicons name="leaf" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Staking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#6366F1'}]}>
              <Ionicons name="link" size={24} color="#FFF" />
              <Text style={styles.actionBtnText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tokens List */}
        <View style={styles.tokensContainer}>
          <View style={styles.tokensHeader}>
            <Text style={styles.tokensTitle}>Tokens</Text>
            <View style={styles.tokensHeaderActions}>
              <TouchableOpacity style={styles.tokenHeaderButton}>
                <Ionicons name="search" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tokenHeaderButton}>
                <Ionicons name="add-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tokenHeaderButton}>
                <Ionicons name="settings" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* USDT with PEZ badge */}
          <View style={styles.tokenItem}>
            <View style={styles.tokenItemLeft}>
              <View style={styles.tokenIconContainer}>
                <Image
                  source={{ uri: 'https://customer-assets.emergentagent.com/job_digital-kurdistan/artifacts/8lztwx8u_USDT%28hez%29.png' }}
                  style={styles.tokenIcon}
                />
                <Image
                  source={{ uri: 'https://customer-assets.emergentagent.com/job_mobile-wallet-app-3/artifacts/jjj4s5p3_pez_logo.jpg' }}
                  style={styles.networkBadge}
                />
              </View>
              <View>
                <Text style={styles.tokenItemName}>USDT</Text>
                <Text style={styles.tokenItemNetwork}>PEZ Network</Text>
              </View>
            </View>
            <View style={styles.tokenItemRight}>
              <Text style={styles.tokenItemBalance}>0.00</Text>
              <Text style={styles.tokenItemUsd}>$0.00</Text>
            </View>
          </View>

          {/* DOT (Polkadot) */}
          <View style={styles.tokenItem}>
            <View style={styles.tokenItemLeft}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_digital-kurdistan/artifacts/06k2kt5u_dot.png' }}
                style={styles.tokenIcon}
              />
              <View>
                <Text style={styles.tokenItemName}>DOT</Text>
                <Text style={styles.tokenItemNetwork}>Polkadot</Text>
              </View>
            </View>
            <View style={styles.tokenItemRight}>
              <Text style={styles.tokenItemBalance}>0.00</Text>
              <Text style={styles.tokenItemUsd}>$0.00</Text>
            </View>
          </View>

          {/* BTC (Bitcoin) */}
          <View style={styles.tokenItem}>
            <View style={styles.tokenItemLeft}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_digital-kurdistan/artifacts/7obzx4ca_bitcoin.png' }}
                style={styles.tokenIcon}
              />
              <View>
                <Text style={styles.tokenItemName}>BTC</Text>
                <Text style={styles.tokenItemNetwork}>Bitcoin</Text>
              </View>
            </View>
            <View style={styles.tokenItemRight}>
              <Text style={styles.tokenItemBalance}>0.00</Text>
              <Text style={styles.tokenItemUsd}>$0.00</Text>
            </View>
          </View>

          {/* ETH (Ethereum) */}
          <View style={styles.tokenItem}>
            <View style={styles.tokenItemLeft}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_digital-kurdistan/artifacts/l927j96q_etherium.png' }}
                style={styles.tokenIcon}
              />
              <View>
                <Text style={styles.tokenItemName}>ETH</Text>
                <Text style={styles.tokenItemNetwork}>Ethereum</Text>
              </View>
            </View>
            <View style={styles.tokenItemRight}>
              <Text style={styles.tokenItemBalance}>0.00</Text>
              <Text style={styles.tokenItemUsd}>$0.00</Text>
            </View>
          </View>

          {/* BNB (Binance Coin) */}
          <View style={styles.tokenItem}>
            <View style={styles.tokenItemLeft}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_digital-kurdistan/artifacts/2k07ckau_BNB_logo.png' }}
                style={styles.tokenIcon}
              />
              <View>
                <Text style={styles.tokenItemName}>BNB</Text>
                <Text style={styles.tokenItemNetwork}>Binance Smart Chain</Text>
              </View>
            </View>
            <View style={styles.tokenItemRight}>
              <Text style={styles.tokenItemBalance}>0.00</Text>
              <Text style={styles.tokenItemUsd}>$0.00</Text>
            </View>
          </View>

          {/* ADA (Cardano) */}
          <View style={styles.tokenItem}>
            <View style={styles.tokenItemLeft}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_digital-kurdistan/artifacts/k5rl2t4g_ADAlogo.png' }}
                style={styles.tokenIcon}
              />
              <View>
                <Text style={styles.tokenItemName}>ADA</Text>
                <Text style={styles.tokenItemNetwork}>Cardano</Text>
              </View>
            </View>
            <View style={styles.tokenItemRight}>
              <Text style={styles.tokenItemBalance}>0.00</Text>
              <Text style={styles.tokenItemUsd}>$0.00</Text>
            </View>
          </View>

          {/* SOL (Solana) */}
          <View style={styles.tokenItem}>
            <View style={styles.tokenItemLeft}>
              <Image
                source={{ uri: 'https://customer-assets.emergentagent.com/job_digital-kurdistan/artifacts/ldg2spf2_SOLlogo.png' }}
                style={styles.tokenIcon}
              />
              <View>
                <Text style={styles.tokenItemName}>SOL</Text>
                <Text style={styles.tokenItemNetwork}>Solana</Text>
              </View>
            </View>
            <View style={styles.tokenItemRight}>
              <Text style={styles.tokenItemBalance}>0.00</Text>
              <Text style={styles.tokenItemUsd}>$0.00</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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

export default function HomeScreen({ navigation }: any) {
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
        options={{
          tabBarLabel: i18n.t('home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      >
        {() => <HomeTab navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen
        name="Wallet"
        component={WalletTab}
        options={{
          tabBarLabel: i18n.t('wallet'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Citizens"
        component={CitizensTab}
        options={{
          tabBarLabel: i18n.t('citizens'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Referral"
        component={ReferralTab}
        options={{
          tabBarLabel: i18n.t('referral'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTab}
        options={{
          tabBarLabel: i18n.t('profile'),
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
  { id: '12', label: 'More', icon: 'apps', color: '#9333EA' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  walletScrollContent: {
    paddingBottom: 80,
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
    width: width - 32,
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
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 64) / 4,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCardFirst: {
    marginRight: 'auto',
  },
  actionCardLast: {
    marginLeft: 'auto',
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
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: '#FFF',
  },
  // New Wallet Styles
  balanceRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  balanceCardNew: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tokenLogoNew: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  tokenSymbolNew: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  balanceAmountNew: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EE2A35',
    marginBottom: 4,
  },
  tokenNameNew: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsContainer: {
    margin: 16,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionBtn: {
    width: (width - 80) / 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  tokensContainer: {
    margin: 16,
    marginTop: 0,
  },
  tokensHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  tokensTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  tokensHeaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  tokenHeaderButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tokenItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  networkBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  tokenItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  tokenItemNetwork: {
    fontSize: 12,
    color: '#6B7280',
  },
  tokenItemRight: {
    alignItems: 'flex-end',
  },
  tokenItemBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  tokenItemUsd: {
    fontSize: 12,
    color: '#6B7280',
  },
});
