import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Hemwelatî</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={Colors.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Official Citizen Card */}
        <View style={styles.card}>
          {/* Burgundy Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.headerText1}>KOMARA KURDISTANÊ</Text>
            <Text style={styles.headerText2}>HEMWELATÎ</Text>
          </View>

          {/* Main Content - White Background */}
          <View style={styles.cardBody}>
            {/* Photo and Info Section */}
            <View style={styles.topSection}>
              {/* Photo */}
              <View style={styles.photoContainer}>
                {citizen.photo ? (
                  <Image source={{ uri: citizen.photo }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="person" size={50} color="#999" />
                  </View>
                )}
              </View>

              {/* Info List */}
              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>NAVÊ/NAME:</Text>
                  <Text style={styles.infoValue}>{citizen.fullName}</Text>
                </View>

                {citizen.fatherName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>BAV/FATHER'S NAME:</Text>
                    <Text style={styles.infoValue}>{citizen.fatherName}</Text>
                  </View>
                )}

                {citizen.grandfatherName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>DAPÎR/GRANDFATHER:</Text>
                    <Text style={styles.infoValue}>{citizen.grandfatherName}</Text>
                  </View>
                )}

                {citizen.greatGrandfatherName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>DAPÎRA BIRA/G.GRANDFATHER:</Text>
                    <Text style={styles.infoValue}>{citizen.greatGrandfatherName}</Text>
                  </View>
                )}

                {citizen.motherName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>DAYÊ/MOTHER:</Text>
                    <Text style={styles.infoValue}>{citizen.motherName}</Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ZEWICÎNÊ/MARITAL STATUS:</Text>
                  <Text style={styles.infoValue}>
                    {citizen.maritalStatus === 'married' ? 'Married' : 'Single'}
                  </Text>
                </View>

                {citizen.maritalStatus === 'married' && citizen.spouseName && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>HEVJÎN/SPOUSE:</Text>
                    <Text style={styles.infoValue}>{citizen.spouseName}</Text>
                  </View>
                )}

                {citizen.children && citizen.children.length > 0 && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ZAROK/CHILDREN:</Text>
                    <Text style={styles.infoValue}>{citizen.children.length}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* PEZ Sun Logo */}
            <View style={styles.sunContainer}>
              <Ionicons name="sunny" size={80} color="#D4A017" />
            </View>

            {/* Region and Citizen ID */}
            <View style={styles.middleSection}>
              <View style={styles.regionRow}>
                <Text style={styles.regionLabel}>HERÊMA/REGION:</Text>
                <Text style={styles.regionValue}>{REGION_LABELS[citizen.region].en}</Text>
              </View>

              <View style={styles.citizenIdRow}>
                <Text style={styles.citizenIdLabel}>JIMARA HEMWELATÎ/CITIZEN ID</Text>
                <Text style={styles.citizenIdValue}>{citizen.citizenId}</Text>
              </View>
            </View>
          </View>

          {/* Green Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              <View style={styles.footerRow}>
                <Text style={styles.footerLabel}>NASNAMA DIJÎTAL/DIGITAL ID</Text>
                <Text style={styles.footerValue}>{citizen.citizenId.replace(/-/g, '')}</Text>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.footerLabel}>JIMARA VEKIRAN/ACCOUNT#:</Text>
                <Text style={styles.footerValue}>{citizen.qrCode.substring(0, 12)}</Text>
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.footerLabel}>DAXWAZ/ISSUED:</Text>
                <Text style={styles.footerValue}>{formatDate(citizen.approvedAt)}</Text>
              </View>
            </View>

            <View style={styles.footerRight}>
              <QRCode value={citizen.qrCode} size={70} backgroundColor="transparent" color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={24} color={Colors.mint} />
          <Text style={styles.statusText}>Verified Kurdistan Citizen</Text>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          This official digital citizenship card grants you full access to Governance (Welati) and all citizen-only features on PezkuwiChain.
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
  cardHeader: {
    backgroundColor: '#8B1538', // Burgundy
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  headerText1: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D4A017', // Gold
    letterSpacing: 1,
  },
  headerText2: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 4,
  },
  cardBody: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#D0D0D0',
    marginRight: Spacing.md,
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
    backgroundColor: '#D0D0D0',
  },
  infoList: {
    flex: 1,
  },
  infoRow: {
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  sunContainer: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  middleSection: {
    marginTop: Spacing.sm,
  },
  regionRow: {
    marginBottom: Spacing.sm,
  },
  regionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  regionValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  citizenIdRow: {
    marginTop: Spacing.sm,
  },
  citizenIdLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  citizenIdValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  cardFooter: {
    backgroundColor: '#007A3D', // Green
    flexDirection: 'row',
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  footerLeft: {
    flex: 1,
  },
  footerRow: {
    marginBottom: 6,
  },
  footerLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  footerValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D4A017', // Gold
  },
  footerRight: {
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: Spacing.xl,
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

