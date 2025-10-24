import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';

interface Ministry {
  id: string;
  name: string;
  nameKu: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}

export default function GovernanceScreen({ navigation }: any) {
  const [isHemwelati, setIsHemwelati] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkKYCStatus();
  }, []);

  const checkKYCStatus = async () => {
    try {
      const kycData = await AsyncStorage.getItem('kyc_data');
      const kycStatus = await AsyncStorage.getItem('kyc_status');
      
      if (kycData && kycStatus === 'approved') {
        setIsHemwelati(true);
      } else {
        setIsHemwelati(false);
      }
    } catch (error) {
      console.error('Error checking KYC status:', error);
      setIsHemwelati(false);
    } finally {
      setLoading(false);
    }
  };

  const ministries: Ministry[] = [
    {
      id: 'presidency',
      name: 'Presidency',
      nameKu: 'Serokayetî',
      icon: 'business',
      color: '#E74C3C',
      description: 'Office of the President',
    },
    {
      id: 'parliament',
      name: 'Parliament',
      nameKu: 'Meclîs',
      icon: 'people',
      color: '#3498DB',
      description: 'Legislative Assembly',
    },
    {
      id: 'ministries',
      name: 'Ministries',
      nameKu: 'Wezaretî',
      icon: 'briefcase',
      color: '#9B59B6',
      description: 'Cabinet Ministries',
    },
    {
      id: 'voting',
      name: 'Voting',
      nameKu: 'Dengdan',
      icon: 'checkmark-circle',
      color: '#1ABC9C',
      description: 'Proposals & Voting',
    },
    {
      id: 'finance',
      name: 'Finance',
      nameKu: 'Maliye',
      icon: 'cash',
      color: '#F39C12',
      description: 'Treasury & Budget',
    },
    {
      id: 'justice',
      name: 'Justice',
      nameKu: 'Adalet',
      icon: 'scale',
      color: '#34495E',
      description: 'Legal System',
    },
    {
      id: 'health',
      name: 'Health',
      nameKu: 'Tenduristî',
      icon: 'medical',
      color: '#E91E63',
      description: 'Healthcare Services',
    },
    {
      id: 'education',
      name: 'Education',
      nameKu: 'Perwerde',
      icon: 'school',
      color: '#5C6BC0',
      description: 'Education System',
    },
    {
      id: 'commerce',
      name: 'Commerce',
      nameKu: 'Bazirganî',
      icon: 'cart',
      color: '#26A69A',
      description: 'Trade & Business',
    },
    {
      id: 'media',
      name: 'Media',
      nameKu: 'Medya',
      icon: 'newspaper',
      color: '#FF9800',
      description: 'Press & Communications',
    },
    {
      id: 'culture',
      name: 'Culture & Arts',
      nameKu: 'Çand û Huner',
      icon: 'color-palette',
      color: '#EC407A',
      description: 'Cultural Heritage',
    },
    {
      id: 'tourism',
      name: 'Tourism',
      nameKu: 'Gerîyan',
      icon: 'airplane',
      color: '#00ACC1',
      description: 'Tourism Development',
    },
    {
      id: 'foreign',
      name: 'Foreign Affairs',
      nameKu: 'Karûbarên Derve',
      icon: 'globe',
      color: '#7E57C2',
      description: 'International Relations',
    },
    {
      id: 'interior',
      name: 'Interior',
      nameKu: 'Karûbarên Navxwe',
      icon: 'shield',
      color: '#8D6E63',
      description: 'Internal Security',
    },
    {
      id: 'defense',
      name: 'Defense',
      nameKu: 'Bergiranî',
      icon: 'shield-checkmark',
      color: '#455A64',
      description: 'National Defense',
    },
    {
      id: 'digital',
      name: 'Digital Infrastructure',
      nameKu: 'Binyata Dîjîtal',
      icon: 'server',
      color: '#26C6DA',
      description: 'Technology & Innovation',
    },
    {
      id: 'citizenship',
      name: 'Citizenship Affairs',
      nameKu: 'Karûbarên Hemwelatî',
      icon: 'card',
      color: '#66BB6A',
      description: 'Identity & Registration',
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      nameKu: 'Çandinî',
      icon: 'leaf',
      color: '#8BC34A',
      description: 'Farming & Food Security',
    },
  ];

  const handleMinistryPress = (ministry: Ministry) => {
    if (!isHemwelati) {
      Alert.alert(
        'Access Restricted',
        'You must complete Identity KYC verification to access Governance features.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Complete KYC',
            onPress: () => navigation.navigate('Identity'),
          },
        ]
      );
      return;
    }

    // Navigate to ministry detail screen
    Alert.alert(
      ministry.name,
      `${ministry.nameKu}\n\n${ministry.description}\n\nThis feature is under development.`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isHemwelati) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.restrictedContainer}>
          <Ionicons name="lock-closed" size={80} color={Colors.textLight} />
          <Text style={styles.restrictedTitle}>Access Restricted</Text>
          <Text style={styles.restrictedText}>
            Governance features are only available to verified Hemwelatî (Digital Citizens).
          </Text>
          <Text style={styles.restrictedText}>
            Complete your Identity KYC verification to access:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Vote on proposals</Text>
            <Text style={styles.featureItem}>• Participate in governance</Text>
            <Text style={styles.featureItem}>• Access government services</Text>
            <Text style={styles.featureItem}>• View parliamentary sessions</Text>
          </View>
          <TouchableOpacity
            style={styles.kycButton}
            onPress={() => navigation.navigate('Identity')}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.kycButtonText}>Complete Identity KYC</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Welati Governance</Text>
          <Text style={styles.headerSubtitle}>Komara Kurdistanê</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.verifiedText}>Verified Citizen</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ministries Grid */}
        <View style={styles.grid}>
          {ministries.map((ministry) => (
            <TouchableOpacity
              key={ministry.id}
              style={styles.ministryCard}
              onPress={() => handleMinistryPress(ministry)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: ministry.color }]}>
                <Ionicons name={ministry.icon} size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.ministryName}>{ministry.name}</Text>
              <Text style={styles.ministryNameKu}>{ministry.nameKu}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            As a verified Hemwelatî, you have full access to all governance features.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.lg,
    color: Colors.textLight,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  restrictedTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textDark,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  restrictedText: {
    fontSize: Typography.sizes.md,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  featureList: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureItem: {
    fontSize: Typography.sizes.md,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  kycButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.medium,
  },
  kycButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    ...Shadow.small,
  },
  headerContent: {
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textDark,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#27AE60',
    marginLeft: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
  },
  ministryCard: {
    width: '31%',
    marginHorizontal: '1%',
    marginBottom: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.small,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ministryName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  ministryNameKu: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
});

