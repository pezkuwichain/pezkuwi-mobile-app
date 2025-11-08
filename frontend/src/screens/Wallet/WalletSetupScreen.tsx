import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WalletSetupScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F08080', '#E8C896', '#F5B895']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="wallet" size={80} color="#FFF" />
            <Text style={styles.title}>Setup Your Wallet</Text>
            <Text style={styles.subtitle}>
              Create a new wallet or import an existing one to get started
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Create New Wallet */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate('CreateWallet')}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="add-circle" size={48} color="#F08080" />
              </View>
              <Text style={styles.optionTitle}>Create New Wallet</Text>
              <Text style={styles.optionDescription}>
                Generate a new wallet with a secure seed phrase
              </Text>
              <View style={styles.arrow}>
                <Ionicons name="arrow-forward" size={24} color="#F08080" />
              </View>
            </TouchableOpacity>

            {/* Import Wallet */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate('ImportWallet')}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="download" size={48} color="#7DD3C0" />
              </View>
              <Text style={styles.optionTitle}>Import Wallet</Text>
              <Text style={styles.optionDescription}>
                Import an existing wallet using your seed phrase
              </Text>
              <View style={styles.arrow}>
                <Ionicons name="arrow-forward" size={24} color="#7DD3C0" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={20} color="#FFF" />
            <Text style={styles.footerText}>
              Your keys are stored securely on your device
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  arrow: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
});
