import Button from '@/src/components/ui/Button';
import { useAuth, useTheme } from '@/src/providers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginFormStyles } from './styles';

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export default function LoginForm({ onNavigateToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const {
    login,
    loginWithGoogle,
    loginWithApple,
    error,
    clearError,
    sendPasswordResetEmail,
  } = useAuth();
  const { theme } = useTheme();
  const styles = loginFormStyles(theme);
  const router = useRouter();

  const validateEmail = (emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear email error when user starts typing
    if (emailError) setEmailError('');
    if (error) clearError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) clearError();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(app)');
    } catch (err) {
      const errorObj = err as Error;
      Alert.alert('Login Error', errorObj.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToRegister = () => {
    onNavigateToRegister();
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace('/(app)');
    } catch (err) {
      const errorObj = err as Error;
      if (errorObj.message !== 'SIGN_IN_CANCELLED') {
        Alert.alert(
          'Google Sign-In Error',
          errorObj.message || 'Failed to sign in with Google'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithApple();
      router.replace('/(app)');
    } catch (err) {
      const errorObj = err as Error;
      if (errorObj.message !== 'SIGN_IN_CANCELLED') {
        Alert.alert(
          'Apple Sign-In Error',
          errorObj.message || 'Failed to sign in with Apple'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert(
        'Email Required',
        'Please enter your email address to reset your password.'
      );
      return;
    }

    Alert.alert('Reset Password', `Send password reset email to ${email}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: async () => {
          try {
            await sendPasswordResetEmail(email);
            Alert.alert(
              'Email Sent',
              'Check your email for instructions to reset your password.'
            );
          } catch (err) {
            const errorObj = err as Error;
            Alert.alert(
              'Error',
              errorObj.message || 'Failed to send password reset email'
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Focus Fit</Text>
        <Text style={styles.subtitle}>Quick workouts for busy people</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          placeholderTextColor={theme.colors.text + '80'}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isSubmitting}
        />
        {emailError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.text + '80'}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          editable={!isSubmitting}
        />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.buttonText}>Logging in...</Text>
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForgotPassword}
          disabled={isSubmitting}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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

        {Platform.OS === 'ios' && (
          <Button
            title="Continue with Apple"
            variant="secondary"
            onPress={handleAppleSignIn}
            disabled={isSubmitting}
            style={styles.socialButton}
          />
        )}

        <TouchableOpacity
          onPress={handleNavigateToRegister}
          disabled={isSubmitting}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
