import Button from '@/src/components/ui/Button';
import { useAuth, useTheme } from '@/src/providers';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { registerFormStyles } from './styles';

interface RegisterFormProps {
  onNavigateToLogin: () => void;
}

export default function RegisterForm({ onNavigateToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, loginWithGoogle, loginWithApple, error, clearError } =
    useAuth();
  const { theme } = useTheme();
  const styles = registerFormStyles(theme);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) clearError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) clearError();
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password);
      Alert.alert(
        'Success',
        'Account created successfully! You can now sign in.'
      );
      onNavigateToLogin();
    } catch (err) {
      const errorObj = err as Error;
      Alert.alert(
        'Registration Error',
        errorObj.message || 'Failed to register'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      const errorObj = err as Error;
      Alert.alert(
        'Google Sign-In Error',
        errorObj.message || 'Failed to sign in with Google'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithApple();
    } catch (err) {
      const errorObj = err as Error;
      Alert.alert(
        'Apple Sign-In Error',
        errorObj.message || 'Failed to sign in with Apple'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToLogin = () => {
    onNavigateToLogin();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Create Account</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.text + '80'}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isSubmitting}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.text + '80'}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          editable={!isSubmitting}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={theme.colors.text + '80'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!isSubmitting}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title="Continue with Google"
          variant="secondary"
          onPress={handleGoogleSignIn}
          disabled={isSubmitting}
          style={styles.socialButton}
        />

        <Button
          title="Continue with Apple"
          variant="secondary"
          onPress={handleAppleSignIn}
          disabled={isSubmitting}
          style={styles.socialButton}
        />

        <TouchableOpacity
          onPress={handleNavigateToLogin}
          disabled={isSubmitting}
        >
          <Text style={styles.linkText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
