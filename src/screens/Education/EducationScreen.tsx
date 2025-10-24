import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/colors';

interface Certificate {
  id: string;
  title: string;
  institution: string;
  issueDate: string;
  certificateId: string;
  type: 'degree' | 'course' | 'skill' | 'achievement';
  verified: boolean;
  ipfsHash?: string;
}

interface EducationStats {
  totalCertificates: number;
  verifiedCertificates: number;
  skillsAcquired: number;
  learningHours: number;
}

export default function EducationScreen({ navigation }: any) {
  const [stats] = useState<EducationStats>({
    totalCertificates: 8,
    verifiedCertificates: 6,
    skillsAcquired: 15,
    learningHours: 240,
  });

  const [certificates] = useState<Certificate[]>([
    {
      id: '1',
      title: 'Bachelor of Computer Science',
      institution: 'University of Kurdistan',
      issueDate: '2022-06-15',
      certificateId: 'UOK-CS-2022-1234',
      type: 'degree',
      verified: true,
      ipfsHash: 'QmX7Y8Z9...',
    },
    {
      id: '2',
      title: 'Blockchain Development Certificate',
      institution: 'Digital Kurdistan Academy',
      issueDate: '2023-03-20',
      certificateId: 'DKA-BC-2023-5678',
      type: 'course',
      verified: true,
      ipfsHash: 'QmA1B2C3...',
    },
    {
      id: '3',
      title: 'Kurdish Language Proficiency',
      institution: 'Kurdistan Cultural Institute',
      issueDate: '2023-08-10',
      certificateId: 'KCI-KL-2023-9012',
      type: 'skill',
      verified: true,
      ipfsHash: 'QmD4E5F6...',
    },
    {
      id: '4',
      title: 'Smart Contract Security',
      institution: 'PezkuwiChain Foundation',
      issueDate: '2024-01-15',
      certificateId: 'PKW-SCS-2024-3456',
      type: 'course',
      verified: false,
    },
  ]);

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'degree':
        return 'school';
      case 'course':
        return 'book';
      case 'skill':
        return 'ribbon';
      case 'achievement':
        return 'trophy';
      default:
        return 'document';
    }
  };

  const getCertificateColor = (type: string) => {
    switch (type) {
      case 'degree':
        return Colors.primary;
      case 'course':
        return Colors.success;
      case 'skill':
        return Colors.kurdishGold;
      case 'achievement':
        return Colors.coral;
      default:
        return Colors.textGray;
    }
  };

  const shareCertificate = async (certificate: Certificate) => {
    try {
      await Share.share({
        message: `🎓 ${certificate.title}\n\nIssued by: ${certificate.institution}\nDate: ${certificate.issueDate}\nCertificate ID: ${certificate.certificateId}\n\nVerified on PezkuwiChain - Digital Kurdistan's Blockchain Platform`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const verifyCertificate = (certificate: Certificate) => {
    if (certificate.verified) {
      Alert.alert(
        '✓ Verified Certificate',
        `This certificate is verified on PezkuwiChain blockchain.\n\nIPFS Hash: ${certificate.ipfsHash}\nCertificate ID: ${certificate.certificateId}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Pending Verification',
        'This certificate is pending blockchain verification. Please check back later.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary, Colors.success]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Perwerde</Text>
              <Text style={styles.headerSubtitle}>Education & Certificates</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                Alert.alert(
                  'Add Certificate',
                  'Request your institution to issue a certificate on PezkuwiChain',
                  [{ text: 'OK' }]
                )
              }
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons
                name="document-text"
                size={28}
                color={Colors.primary}
              />
              <Text style={styles.statValue}>{stats.totalCertificates}</Text>
              <Text style={styles.statLabel}>Certificates</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={Colors.success}
              />
              <Text style={styles.statValue}>{stats.verifiedCertificates}</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="bulb" size={28} color={Colors.kurdishGold} />
              <Text style={styles.statValue}>{stats.skillsAcquired}</Text>
              <Text style={styles.statLabel}>Skills</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={28} color={Colors.coral} />
              <Text style={styles.statValue}>{stats.learningHours}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
          </View>
        </View>

        {/* Certificates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Certificates</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {certificates.map((certificate) => (
            <TouchableOpacity
              key={certificate.id}
              style={styles.certificateCard}
              onPress={() => verifyCertificate(certificate)}
              activeOpacity={0.7}
            >
              <View style={styles.certificateHeader}>
                <View
                  style={[
                    styles.certificateIconContainer,
                    {
                      backgroundColor:
                        getCertificateColor(certificate.type) + '20',
                    },
                  ]}
                >
                  <Ionicons
                    name={getCertificateIcon(certificate.type)}
                    size={28}
                    color={getCertificateColor(certificate.type)}
                  />
                </View>
                <View style={styles.certificateInfo}>
                  <Text style={styles.certificateTitle}>
                    {certificate.title}
                  </Text>
                  <Text style={styles.certificateInstitution}>
                    {certificate.institution}
                  </Text>
                  <Text style={styles.certificateDate}>
                    Issued: {certificate.issueDate}
                  </Text>
                </View>
              </View>

              <View style={styles.certificateFooter}>
                <View style={styles.certificateId}>
                  <Ionicons
                    name="finger-print"
                    size={14}
                    color={Colors.textGray}
                  />
                  <Text style={styles.certificateIdText}>
                    {certificate.certificateId}
                  </Text>
                </View>
                <View style={styles.certificateActions}>
                  {certificate.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons
                        name="shield-checkmark"
                        size={14}
                        color={Colors.success}
                      />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => shareCertificate(certificate)}
                    style={styles.shareButton}
                  >
                    <Ionicons
                      name="share-social-outline"
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Learning Paths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Learning Paths</Text>
          
          <TouchableOpacity style={styles.pathCard} activeOpacity={0.7}>
            <LinearGradient
              colors={[Colors.primary + '20', Colors.success + '20']}
              style={styles.pathGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.pathContent}>
                <View style={styles.pathIcon}>
                  <Ionicons name="code-slash" size={32} color={Colors.primary} />
                </View>
                <View style={styles.pathInfo}>
                  <Text style={styles.pathTitle}>
                    Blockchain Developer Path
                  </Text>
                  <Text style={styles.pathDescription}>
                    Master Substrate & Polkadot development
                  </Text>
                  <View style={styles.pathMeta}>
                    <View style={styles.pathMetaItem}>
                      <Ionicons name="book" size={14} color={Colors.textGray} />
                      <Text style={styles.pathMetaText}>8 Courses</Text>
                    </View>
                    <View style={styles.pathMetaItem}>
                      <Ionicons name="time" size={14} color={Colors.textGray} />
                      <Text style={styles.pathMetaText}>120 Hours</Text>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.textGray}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pathCard} activeOpacity={0.7}>
            <LinearGradient
              colors={[Colors.kurdishGold + '20', Colors.coral + '20']}
              style={styles.pathGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.pathContent}>
                <View style={styles.pathIcon}>
                  <Ionicons name="language" size={32} color={Colors.kurdishGold} />
                </View>
                <View style={styles.pathInfo}>
                  <Text style={styles.pathTitle}>Kurdish Culture & Heritage</Text>
                  <Text style={styles.pathDescription}>
                    Learn Kurdish language and history
                  </Text>
                  <View style={styles.pathMeta}>
                    <View style={styles.pathMetaItem}>
                      <Ionicons name="book" size={14} color={Colors.textGray} />
                      <Text style={styles.pathMetaText}>5 Courses</Text>
                    </View>
                    <View style={styles.pathMetaItem}>
                      <Ionicons name="time" size={14} color={Colors.textGray} />
                      <Text style={styles.pathMetaText}>60 Hours</Text>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.textGray}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color={Colors.primary} />
            <Text style={styles.infoText}>
              All certificates are stored on PezkuwiChain blockchain and IPFS,
              ensuring permanent verification and authenticity.
            </Text>
          </View>
        </View>

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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textGray,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  certificateCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  certificateHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  certificateIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  certificateInstitution: {
    fontSize: 14,
    color: Colors.textGray,
    marginBottom: 2,
  },
  certificateDate: {
    fontSize: 12,
    color: Colors.textGray,
  },
  certificateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  certificateId: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  certificateIdText: {
    fontSize: 12,
    color: Colors.textGray,
    fontFamily: 'monospace',
  },
  certificateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  shareButton: {
    padding: 4,
  },
  pathCard: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pathGradient: {
    padding: 16,
  },
  pathContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  pathDescription: {
    fontSize: 13,
    color: Colors.textGray,
    marginBottom: 8,
  },
  pathMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  pathMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pathMetaText: {
    fontSize: 12,
    color: Colors.textGray,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textDark,
    lineHeight: 20,
  },
});

