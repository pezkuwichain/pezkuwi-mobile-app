import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { KYCFormData, Region, MaritalStatus, REGION_LABELS } from '../../types/kyc';
import { kycService } from '../../services/kycService';

export default function IdentityKYCFormScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: '',
    fatherName: '',
    grandfatherName: '',
    greatGrandfatherName: '',
    motherName: '',
    maritalStatus: 'single',
    region: 'basur',
  });

  const updateField = (field: keyof KYCFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateChild = (index: number, name: string) => {
    const children = formData.children || [];
    children[index] = { name, order: index + 1 };
    setFormData({ ...formData, children });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName || !formData.fatherName || !formData.motherName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.maritalStatus === 'married' && !formData.spouseName) {
      Alert.alert('Error', 'Please enter your spouse name');
      return;
    }

    setLoading(true);
    try {
      // Submit KYC
      const submission = await kycService.submitKYC(formData, null); // TODO: Add signer
      
      Alert.alert(
        'KYC Submitted',
        'Your KYC application has been submitted for review. You will be notified once approved.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit KYC. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderChildInputs = () => {
    if (!formData.numberOfChildren || formData.numberOfChildren === 0) return null;

    return Array.from({ length: formData.numberOfChildren }, (_, index) => (
      <View key={index} style={styles.inputContainer}>
        <Text style={styles.label}>{index + 1}. Child's Name</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color={Colors.textGray} />
          <TextInput
            style={styles.input}
            placeholder={`${index + 1}. child's name`}
            placeholderTextColor={Colors.textLight}
            value={formData.children?.[index]?.name || ''}
            onChangeText={(text) => updateChild(index, text)}
          />
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity KYC</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={Colors.teal} />
          <Text style={styles.infoText}>
            Complete this form to become a verified Kurdistan Digital Citizen and access Governance features.
          </Text>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={Colors.textGray} />
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor={Colors.textLight}
              value={formData.fullName}
              onChangeText={(text) => updateField('fullName', text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Father's Name *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="man-outline" size={20} color={Colors.textGray} />
            <TextInput
              style={styles.input}
              placeholder="Your father's name"
              placeholderTextColor={Colors.textLight}
              value={formData.fatherName}
              onChangeText={(text) => updateField('fatherName', text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Grandfather's Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="man-outline" size={20} color={Colors.textGray} />
            <TextInput
              style={styles.input}
              placeholder="Your grandfather's name"
              placeholderTextColor={Colors.textLight}
              value={formData.grandfatherName}
              onChangeText={(text) => updateField('grandfatherName', text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Great-Grandfather's Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="man-outline" size={20} color={Colors.textGray} />
            <TextInput
              style={styles.input}
              placeholder="Your great-grandfather's name"
              placeholderTextColor={Colors.textLight}
              value={formData.greatGrandfatherName}
              onChangeText={(text) => updateField('greatGrandfatherName', text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mother's Name *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="woman-outline" size={20} color={Colors.textGray} />
            <TextInput
              style={styles.input}
              placeholder="Your mother's name"
              placeholderTextColor={Colors.textLight}
              value={formData.motherName}
              onChangeText={(text) => updateField('motherName', text)}
            />
          </View>
        </View>

        {/* Marital Status */}
        <Text style={styles.sectionTitle}>Marital Status</Text>

        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.maritalStatus === 'single' && styles.radioButtonActive,
            ]}
            onPress={() => updateField('maritalStatus', 'single')}
          >
            <Ionicons
              name={formData.maritalStatus === 'single' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={formData.maritalStatus === 'single' ? Colors.teal : Colors.textGray}
            />
            <Text style={styles.radioLabel}>Single</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.maritalStatus === 'married' && styles.radioButtonActive,
            ]}
            onPress={() => updateField('maritalStatus', 'married')}
          >
            <Ionicons
              name={formData.maritalStatus === 'married' ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={formData.maritalStatus === 'married' ? Colors.teal : Colors.textGray}
            />
            <Text style={styles.radioLabel}>Married</Text>
          </TouchableOpacity>
        </View>

        {formData.maritalStatus === 'married' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Spouse's Name *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="heart-outline" size={20} color={Colors.textGray} />
                <TextInput
                  style={styles.input}
                  placeholder="Your spouse's name"
                  placeholderTextColor={Colors.textLight}
                  value={formData.spouseName}
                  onChangeText={(text) => updateField('spouseName', text)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Number of Children</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="people-outline" size={20} color={Colors.textGray} />
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="number-pad"
                  value={formData.numberOfChildren?.toString() || ''}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    updateField('numberOfChildren', num);
                    if (num > 0) {
                      updateField('children', Array(num).fill({ name: '', order: 0 }));
                    }
                  }}
                />
              </View>
            </View>

            {renderChildInputs()}
          </>
        )}

        {/* Region */}
        <Text style={styles.sectionTitle}>Region</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Your Region *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.region}
              onValueChange={(value) => updateField('region', value)}
              style={styles.picker}
            >
              {Object.entries(REGION_LABELS).map(([key, value]) => (
                <Picker.Item key={key} label={value.en} value={key} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit KYC Application</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.teal + '20',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.small,
    color: Colors.textDark,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.textDark,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.medium,
    color: Colors.textDark,
    marginLeft: Spacing.sm,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: Spacing.sm,
  },
  radioButtonActive: {
    borderColor: Colors.teal,
    backgroundColor: Colors.teal + '10',
  },
  radioLabel: {
    fontSize: Typography.sizes.medium,
    color: Colors.textDark,
  },
  pickerWrapper: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.teal,
    borderRadius: BorderRadius.xxlarge,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    ...Shadow.soft,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
});

