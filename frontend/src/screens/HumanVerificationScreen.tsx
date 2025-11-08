import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CAPTCHA_QUESTION = {
  question: 'What is 5 + 3?',
  answer: '8',
};

export default function HumanVerificationScreen({ navigation }: any) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (answer.trim() === CAPTCHA_QUESTION.answer) {
      navigation.navigate('Auth');
    } else {
      setError('Incorrect answer. Please try again.');
      setAnswer('');
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
