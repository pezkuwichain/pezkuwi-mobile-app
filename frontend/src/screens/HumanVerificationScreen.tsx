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

  const turnstileHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
      <style>
        body {
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #F8F9FA;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .container {
          text-align: center;
          width: 100%;
          max-width: 400px;
        }
        .icon {
          font-size: 60px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1F2937;
          margin-bottom: 8px;
        }
        p {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 40px;
        }
        .cf-turnstile {
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">🛡️</div>
        <h1>Human Verification</h1>
        <p>Please complete the security check to continue</p>
        <div class="cf-turnstile" 
             data-sitekey="${TURNSTILE_SITE_KEY}"
             data-callback="onSuccess"
             data-error-callback="onError"
             data-theme="light">
        </div>
      </div>
      <script>
        function onSuccess(token) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'turnstile-success',
            token: token
          }));
        }
        
        function onError() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'turnstile-error'
          }));
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      {verifying && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#EE2A35" />
          <Text style={styles.verifyingText}>Verifying...</Text>
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ html: turnstileHTML }}
        onMessage={handleMessage}
        onLoadEnd={() => setLoading(false)}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#EE2A35" />
        </View>
      )}
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
