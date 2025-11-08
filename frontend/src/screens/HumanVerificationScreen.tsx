import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

export default function HumanVerificationScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleTurnstileToken = async (token: string) => {
    setVerifying(true);
    
    try {
      // Verify token with backend
      const response = await fetch('http://localhost:8001/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (result.success) {
        navigation.navigate('Auth');
      } else {
        Alert.alert('Verification Failed', 'Please try again');
        // Reload Turnstile
        webViewRef.current?.reload();
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    
    if (data.type === 'turnstile-success') {
      handleTurnstileToken(data.token);
    } else if (data.type === 'turnstile-error') {
      Alert.alert('Error', 'Verification failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={80} color="#00A651" />
        </View>
        
        <Text style={styles.title}>Human Verification</Text>
        <Text style={styles.subtitle}>Please answer this simple question to continue</Text>
        
        <View style={styles.questionBox}>
          <Text style={styles.question}>{CAPTCHA_QUESTION.question}</Text>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Your answer"
          value={answer}
          onChangeText={setAnswer}
          keyboardType="number-pad"
          autoFocus
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
        >
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  questionBox: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00A651',
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  error: {
    color: '#EE2A35',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#00A651',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
