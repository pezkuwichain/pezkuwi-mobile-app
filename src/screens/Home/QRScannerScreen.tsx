import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

export default function QRScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    
    try {
      // Try to parse as JSON (payment request)
      const parsed = JSON.parse(data);
      
      if (parsed.merchant && parsed.amount && parsed.token) {
        // Payment request QR code
        Alert.alert(
          'Payment Request',
          `Merchant: ${parsed.merchant.substring(0, 10)}...\nAmount: ${parsed.amount} ${parsed.token}\nNote: ${parsed.note || 'N/A'}`,
          [
            { text: 'Cancel', onPress: () => setScanned(false) },
            {
              text: 'Pay',
              onPress: () => {
                navigation.navigate('Wallet');
                setScanned(false);
              },
            },
          ]
        );
      } else if (parsed.address) {
        // Receive address QR code
        Alert.alert(
          'Address Scanned',
          `Address: ${parsed.address.substring(0, 20)}...`,
          [
            { text: 'Cancel', onPress: () => setScanned(false) },
            {
              text: 'Send',
              onPress: () => {
                navigation.navigate('Wallet');
                setScanned(false);
              },
            },
          ]
        );
      } else {
        // Unknown QR format
        Alert.alert('QR Code Scanned', data, [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
      }
    } catch (error) {
      // Not JSON, treat as plain text (address or referral code)
      if (data.startsWith('5') && data.length > 40) {
        // Looks like a Substrate address
        Alert.alert(
          'Address Scanned',
          `Address: ${data.substring(0, 20)}...`,
          [
            { text: 'Cancel', onPress: () => setScanned(false) },
            {
              text: 'Send',
              onPress: () => {
                navigation.navigate('Wallet');
                setScanned(false);
              },
            },
          ]
        );
      } else if (data.startsWith('PKW-')) {
        // Referral code
        Alert.alert(
          'Referral Code',
          `Code: ${data}`,
          [
            { text: 'Cancel', onPress: () => setScanned(false) },
            {
              text: 'Use Code',
              onPress: () => {
                navigation.navigate('Referral');
                setScanned(false);
              },
            },
          ]
        );
      } else {
        Alert.alert('QR Code Scanned', data, [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={64} color={Colors.textGray} />
        <Text style={styles.message}>No access to camera</Text>
        <Text style={styles.submessage}>
          Please enable camera permission in settings
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
      </View>

      {/* Scanning Frame */}
      <View style={styles.scanFrame}>
        <View style={styles.corner} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>

      {/* Instructions */}
      <View style={styles.footer}>
        <Text style={styles.instruction}>
          Align QR code within the frame
        </Text>
        {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.primary,
    borderWidth: 4,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    top: undefined,
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 4,
  },
  cornerBottomRight: {
    top: undefined,
    left: undefined,
    right: 0,
    bottom: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  scanAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: 20,
  },
  submessage: {
    fontSize: 14,
    color: Colors.textGray,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

