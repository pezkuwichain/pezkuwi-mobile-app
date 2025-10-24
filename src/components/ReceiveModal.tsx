import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Colors from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../constants/theme';

interface ReceiveModalProps {
  visible: boolean;
  onClose: () => void;
  token: {
    symbol: string;
    name: string;
    icon: any;
    color: string;
  };
}

export default function ReceiveModal({ visible, onClose, token }: ReceiveModalProps) {
  // Mock wallet address - in production, this would come from user's wallet
  const walletAddress = 'pezkuwi1a2b3c4d5e6f7g8h9i0j';
  const network = 'Optimism';

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(walletAddress);
    Alert.alert('Copied!', 'Wallet address copied to clipboard');
  };

  const handleShareAddress = async () => {
    try {
      await Share.share({
        message: `My ${token.symbol} wallet address:\n${walletAddress}\n\nNetwork: ${network}`,
        title: `${token.symbol} Wallet Address`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={Colors.textDark} />
          </TouchableOpacity>

          {/* Token Icon */}
          <Image source={token.icon} style={styles.tokenIcon} />

          {/* Title */}
          <Text style={styles.title}>Receive {token.symbol}</Text>

          {/* QR Code Card */}
          <View style={styles.qrCard}>
            <QRCode value={walletAddress} size={200} />
          </View>

          {/* Wallet Address */}
          <TouchableOpacity
            style={styles.addressContainer}
            onPress={handleCopyAddress}
            activeOpacity={0.7}
          >
            <Text style={styles.addressText}>{walletAddress}</Text>
            <Ionicons name="copy-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.tapToCopy}>Tap to copy</Text>

          {/* Network Badge */}
          <View style={styles.networkBadge}>
            <Ionicons name="globe-outline" size={20} color="#007AFF" />
            <Text style={styles.networkText}>{network} Network</Text>
          </View>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShareAddress}>
            <Ionicons name="share-outline" size={20} color={Colors.textDark} />
            <Text style={styles.shareButtonText}>Share Address</Text>
          </TouchableOpacity>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={24} color="#F59E0B" />
            <Text style={styles.warningText}>
              Only send {token.symbol} to this address on {network} network
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadow.medium,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
  },
  tokenIcon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.small,
    alignSelf: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.lg,
  },
  addressText: {
    fontSize: Typography.sizes.sm,
    fontFamily: 'monospace',
    color: Colors.textDark,
    marginRight: Spacing.sm,
  },
  tapToCopy: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.lg,
    alignSelf: 'center',
  },
  networkText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: '#007AFF',
    marginLeft: Spacing.xs,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  shareButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginLeft: Spacing.sm,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  warningText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: '#92400E',
    marginLeft: Spacing.sm,
  },
});

