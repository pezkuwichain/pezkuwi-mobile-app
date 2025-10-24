import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../constants/theme';

interface SendModalProps {
  visible: boolean;
  onClose: () => void;
  token: {
    symbol: string;
    name: string;
    balance: string;
    icon: any;
    color: string;
  };
}

export default function SendModal({ visible, onClose, token }: SendModalProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('Optimism');

  const handleMaxAmount = () => {
    setAmount(token.balance);
  };

  const handleSend = () => {
    if (!recipientAddress) {
      Alert.alert('Error', 'Please enter recipient address');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter valid amount');
      return;
    }
    if (parseFloat(amount) > parseFloat(token.balance)) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send ${amount} ${token.symbol} to ${recipientAddress.substring(0, 10)}...?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: Integrate with blockchain service
            Alert.alert('Success', 'Transaction submitted!');
            onClose();
            setRecipientAddress('');
            setAmount('');
          },
        },
      ]
    );
  };

  const handleQRScan = () => {
    // TODO: Open QR scanner
    Alert.alert('QR Scanner', 'QR scanner will be implemented');
  };

  const handlePaste = async () => {
    // TODO: Paste from clipboard
    Alert.alert('Paste', 'Clipboard paste will be implemented');
  };

  const usdValue = (parseFloat(amount) || 0) * 1.5; // Mock exchange rate

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
          <Text style={styles.title}>Send {token.symbol}</Text>

          {/* Available Balance */}
          <Text style={styles.balance}>
            Available Balance: {token.balance} {token.symbol}
          </Text>

          {/* Recipient Address */}
          <Text style={styles.label}>Recipient Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter wallet address"
              placeholderTextColor={Colors.textLight}
              value={recipientAddress}
              onChangeText={setRecipientAddress}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.iconButton} onPress={handleQRScan}>
              <Ionicons name="qr-code-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handlePaste}>
              <Ionicons name="clipboard-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="0.00"
              placeholderTextColor={Colors.textLight}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.maxButton} onPress={handleMaxAmount}>
              <Text style={styles.maxButtonText}>MAX</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.usdValue}>USD Value: ${usdValue.toFixed(2)}</Text>

          {/* Network */}
          <View style={styles.networkRow}>
            <Text style={styles.networkLabel}>Network:</Text>
            <TouchableOpacity style={styles.networkSelector}>
              <Text style={styles.networkText}>{network}</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.textDark} />
            </TouchableOpacity>
          </View>

          {/* Transaction Fee */}
          <View style={styles.feeRow}>
            <Text style={styles.feeText}>Fee: 0.001 HEZ (~$0.01)</Text>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: token.color }]}
            onPress={handleSend}
          >
            <Text style={styles.sendButtonText}>Send {token.symbol}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
    left: Spacing.md,
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
  },
  balance: {
    fontSize: Typography.sizes.md,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.md,
    color: Colors.textDark,
    paddingVertical: Spacing.xs,
  },
  iconButton: {
    marginLeft: Spacing.sm,
  },
  maxButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  maxButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  usdValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  networkLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
  },
  networkSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  networkText: {
    fontSize: Typography.sizes.md,
    color: Colors.textDark,
    marginRight: Spacing.xs,
  },
  feeRow: {
    marginTop: Spacing.md,
  },
  feeText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    ...Shadow.small,
  },
  sendButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginRight: Spacing.sm,
  },
});

