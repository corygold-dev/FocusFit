import { useAuth, useTheme } from '@/src/providers';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { confirmationFormStyles } from './styles';

interface ConfirmationFormProps {
  username: string;
  onNavigateToLogin: () => void;
}

export default function ConfirmationForm({ username, onNavigateToLogin }: ConfirmationFormProps) {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { sendEmailVerification, error, clearError } = useAuth();
  const { theme } = useTheme();
  const styles = confirmationFormStyles(theme);

  const handleConfirm = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, just redirect to login since Firebase handles email verification automatically
      // In a full implementation, you would verify the code here
      onNavigateToLogin();
    } catch (err) {
      const errorObj = err as Error;
      Alert.alert('Verification Error', errorObj.message || 'Failed to verify code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await sendEmailVerification();
      Alert.alert('Success', 'Verification email sent!');
    } catch (err) {
      const errorObj = err as Error;
      Alert.alert('Error', errorObj.message || 'Failed to send verification email');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>
          We sent a verification code to your email. Please enter it below.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.usernameText}>Username: {username}</Text>

        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          placeholderTextColor={theme.colors.text + '80'}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          editable={!isSubmitting}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNavigateToLogin}
          disabled={isSubmitting}
          style={styles.backLink}
        >
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
