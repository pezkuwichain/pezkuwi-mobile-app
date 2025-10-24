import React from 'react';
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
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';

interface Ministry {
  id: string;
  name: string;
  nameKu: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  minister?: string;
}

export default function MinistriesScreen({ navigation }: any) {
  const ministries: Ministry[] = [
    {
      id: 'finance',
      name: 'Finance',
      nameKu: 'Maliye',
      icon: 'cash',
      color: '#F39C12',
      description: 'Treasury, Budget & Economic Policy',
      minister: 'Dr. Heval Azad',
    },
    {
      id: 'justice',
      name: 'Justice',
      nameKu: 'Adalet',
      icon: 'scale',
      color: '#34495E',
      description: 'Legal System & Courts',
      minister: 'Av. Leyla Şoreş',
    },
    {
      id: 'health',
      name: 'Health',
      nameKu: 'Tenduristî',
      icon: 'medical',
      color: '#E91E63',
      description: 'Healthcare Services & Public Health',
      minister: 'Dr. Roj Berxwedan',
    },
    {
      id: 'education',
      name: 'Education',
      nameKu: 'Perwerde',
      icon: 'school',
      color: '#5C6BC0',
      description: 'Education System & Universities',
      minister: 'Prof. Aram Zana',
    },
    {
      id: 'commerce',
      name: 'Commerce',
      nameKu: 'Bazirganî',
      icon: 'cart',
      color: '#26A69A',
      description: 'Trade, Business & Industry',
      minister: 'Berivan Qazi',
    },
    {
      id: 'media',
      name: 'Media & Communications',
      nameKu: 'Medya û Ragihandin',
      icon: 'newspaper',
      color: '#FF9800',
      description: 'Press, Broadcasting & Information',
      minister: 'Jiyan Newroz',
    },
    {
      id: 'culture',
      name: 'Culture & Arts',
      nameKu: 'Çand û Huner',
      icon: 'color-palette',
      color: '#EC407A',
      description: 'Cultural Heritage & Arts',
      minister: 'Şêrko Dilan',
    },
    {
      id: 'tourism',
      name: 'Tourism',
      nameKu: 'Gerîyan',
      icon: 'airplane',
      color: '#00ACC1',
      description: 'Tourism Development & Promotion',
      minister: 'Azad Çiya',
    },
    {
      id: 'foreign',
      name: 'Foreign Affairs',
      nameKu: 'Karûbarên Derve',
      icon: 'globe',
      color: '#7E57C2',
      description: 'International Relations & Diplomacy',
      minister: 'Dilşa Rojava',
    },
    {
      id: 'interior',
      name: 'Interior',
      nameKu: 'Karûbarên Navxwe',
      icon: 'shield',
      color: '#8D6E63',
      description: 'Internal Security & Public Order',
      minister: 'Baran Zagros',
    },
    {
      id: 'defense',
      name: 'Defense',
      nameKu: 'Bergiranî',
      icon: 'shield-checkmark',
      color: '#455A64',
      description: 'National Defense & Security',
      minister: 'Gen. Kendal Şoreş',
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      nameKu: 'Çandinî',
      icon: 'leaf',
      color: '#8BC34A',
      description: 'Farming, Food Security & Rural Development',
      minister: 'Hêvî Berxwedan',
    },
    {
      id: 'environment',
      name: 'Environment',
      nameKu: 'Jîngeha',
      icon: 'earth',
      color: '#66BB6A',
      description: 'Environmental Protection & Climate',
      minister: 'Çiya Newroz',
    },
    {
      id: 'energy',
      name: 'Energy',
      nameKu: 'Wize',
      icon: 'flash',
      color: '#FFA726',
      description: 'Energy Resources & Infrastructure',
      minister: 'Roj Azad',
    },
    {
      id: 'transport',
      name: 'Transport',
      nameKu: 'Veguhestin',
      icon: 'car',
      color: '#42A5F5',
      description: 'Transportation & Infrastructure',
      minister: 'Beritan Qazi',
    },
    {
      id: 'labor',
      name: 'Labor & Social Affairs',
      nameKu: 'Kar û Karûbarên Civakî',
      icon: 'people',
      color: '#AB47BC',
      description: 'Employment & Social Welfare',
      minister: 'Heval Dilan',
    },
  ];

  const handleMinistryPress = (ministry: Ministry) => {
    Alert.alert(
      ministry.name,
      `${ministry.nameKu}\n\nMinister: ${ministry.minister}\n\n${ministry.description}\n\nThis feature is under development.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Ministries</Text>
          <Text style={styles.headerSubtitle}>Wezaretî</Text>
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
              {ministry.minister && (
                <Text style={styles.ministerName}>{ministry.minister}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <Ionicons name="information-circle" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Cabinet of {ministries.length} ministries serving the people of Kurdistan.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    ...Shadow.small,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerContent: {
    flex: 1,
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
    marginBottom: Spacing.xs,
  },
  ministerName: {
    fontSize: 10,
    color: Colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
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

