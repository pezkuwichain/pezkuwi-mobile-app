import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletConnectModal } from '@walletconnect/modal-react-native';
import { usePolkadot } from '../../contexts/PolkadotContext';

const { width } = Dimensions.get('window');

export default function WalletSetupScreen({ navigation }: any) {
  const { open, isConnected } = useWalletConnectModal();
  const { accounts } = usePolkadot();

  const handleConnectWallet = async () => {
    try {
      await open();
      
      // If connection succeeds, navigate to main app
      if (isConnected && accounts.length > 0) {
        navigation.navigate('MainTabs');
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // If already connected, go to main app
  React.useEffect(() => {
    if (isConnected && accounts.length > 0) {
      navigation.navigate('MainTabs');
    }
  }, [isConnected, accounts]);

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
            <Text style={styles.title}>Connect Your Wallet</Text>
            <Text style={styles.subtitle}>
              Connect with SubWallet, Nova Wallet, or any Polkadot compatible wallet
            </Text>
          </View>

          {/* Main Action Card */}
          <View style={styles.mainCard}>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={handleConnectWallet}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="link" size={32} color="#FFF" />
                <Text style={styles.buttonTitle}>Connect Wallet</Text>
                <Text style={styles.buttonSubtitle}>
                  via WalletConnect
                </Text>
              </View>
            </TouchableOpacity>

            {/* Supported Wallets */}
            <View style={styles.walletsSection}>
              <Text style={styles.walletsTitle}>Supported Wallets:</Text>
              <View style={styles.walletsList}>
                <View style={styles.walletItem}>
                  <View style={styles.walletIcon}>
                    <Ionicons name="wallet-outline" size={24} color="#F08080" />
                  </View>
                  <Text style={styles.walletName}>SubWallet</Text>
                </View>
                <View style={styles.walletItem}>
                  <View style={styles.walletIcon}>
                    <Ionicons name="wallet-outline" size={24} color="#7DD3C0" />
                  </View>
                  <Text style={styles.walletName}>Nova Wallet</Text>
                </View>
                <View style={styles.walletItem}>
                  <View style={styles.walletIcon}>
                    <Ionicons name="wallet-outline" size={24} color="#C8B6D6" />
                  </View>
                  <Text style={styles.walletName}>Talisman</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={24} color="#FFF" />
              <Text style={styles.infoText}>
                Your keys stay in your wallet
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="lock-closed" size={24} color="#FFF" />
              <Text style={styles.infoText}>
                We never access your private keys
              </Text>
            </View>
          </View>

          {/* How to Connect */}
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => {
              // TODO: Show help modal
            }}
          >
            <Ionicons name="help-circle-outline" size={20} color="#FFF" />
            <Text style={styles.helpText}>How to connect?</Text>
          </TouchableOpacity>
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
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  connectButton: {
    backgroundColor: '#F08080',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 12,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 4,
  },
  walletsSection: {
    marginTop: 8,
  },
  walletsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  walletsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  walletItem: {
    alignItems: 'center',
  },
  walletIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  walletName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoSection: {
    gap: 12,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
});
