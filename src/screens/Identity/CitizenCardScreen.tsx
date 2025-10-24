import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { kycService } from '../../services/kycService';
import { KurdistanCitizen, REGION_LABELS } from '../../types/kyc';

export default function CitizenCardScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [citizen, setCitizen] = useState<KurdistanCitizen | null>(null);

  useEffect(() => {
    loadCitizen();
  }, []);

  const loadCitizen = async () => {
    try {
      const data = await kycService.getCitizen();
      setCitizen(data);
    } catch (error) {
      console.error('Failed to load citizen data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.teal} />
      </SafeAreaView>
    );
  }

  if (!citizen) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No citizen data found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('IdentityKYCForm')}
        >
          <Text style={styles.buttonText}>Complete KYC</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB');
  };

  const expiryDate = new Date(citizen.approvedAt);
  expiryDate.setFullYear(expiryDate.getFullYear() + 2); // 2 years validity

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Citizen</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={Colors.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Citizen Card */}
        <View style={styles.card}>
          {/* Kurdish Flag Header */}
          <LinearGradient
            colors={['#CE1126', '#FFFFFF', '#007A3D']}
            style={styles.flagHeader}
            locations={[0, 0.5, 1]}
          >
            <View style={styles.sunContainer}>
              <Ionicons name="sunny" size={60} color="#EAB308" />
            </View>
          </LinearGradient>

          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Photo and Title */}
            <View style={styles.topSection}>
              <View style={styles.photoContainer}>
                {citizen.photo ? (
                  <Image source={{ uri: citizen.photo }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="person" size={60} color={Colors.textGray} />
                  </View>
                )}
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>KURDISTAN</Text>
                <Text style={styles.cardSubtitle}>DIGITAL CITIZEN</Text>
              </View>
            </View>

            {/* Citizen Info */}
            <View style={styles.infoSection}>
              <Text style={styles.citizenName}>{citizen.fullName.toUpperCase()}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Citizen ID</Text>
                <Text style={styles.infoValue}>{citizen.citizenId}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Region</Text>
                <Text style={styles.infoValue}>
                  {REGION_LABELS[citizen.region].en}
                </Text>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.dateLabel}>Issue date</Text>
                  <Text style={styles.dateValue}>{formatDate(citizen.approvedAt)}</Text>
                  <Text style={styles.dateLabel}>Expiry date</Text>
                  <Text style={styles.dateValue}>{formatDate(expiryDate.getTime())}</Text>
                </View>

                <View style={styles.qrContainer}>
                  <QRCode value={citizen.qrCode} size={80} />
                </View>
              </View>
            </View>
          </View>

          {/* Watermark */}
          <View style={styles.watermark}>
            <Ionicons name="shield-checkmark" size={120} color="rgba(0,0,0,0.03)" />
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.mint} />
          <Text style={styles.statusText}>Verified Citizen</Text>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          This digital citizenship card grants you access to Governance (Welati) and other
          citizen-only features on PezkuwiChain.
        </Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={24} color={Colors.teal} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="qr-code-outline" size={24} color={Colors.teal} />
            <Text style={styles.actionText}>Show QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color={Colors.teal} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xlarge,
    overflow: 'hidden',
    ...Shadow.medium,
  },
  flagHeader: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunContainer: {
    position: 'absolute',
  },
  cardContent: {
    padding: Spacing.xl,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    marginRight: Spacing.lg,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: 1,
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textGray,
    letterSpacing: 0.5,
  },
  infoSection: {
    marginTop: Spacing.md,
  },
  citizenName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: Spacing.lg,
    letterSpacing: 1,
  },
  infoRow: {
    marginBottom: Spacing.md,
  },
  infoLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.xl,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: Typography.sizes.tiny,
    color: Colors.textGray,
    marginTop: Spacing.sm,
  },
  dateValue: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.medium,
    color: Colors.textDark,
  },
  qrContainer: {
    padding: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.small,
  },
  watermark: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -60 }],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mint + '20',
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.mint,
  },
  infoText: {
    fontSize: Typography.sizes.small,
    color: Colors.textGray,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.sizes.small,
    color: Colors.teal,
    fontWeight: Typography.weights.medium,
  },
  errorText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textGray,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.teal,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.xxlarge,
    marginTop: Spacing.xl,
  },
  buttonText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
});

