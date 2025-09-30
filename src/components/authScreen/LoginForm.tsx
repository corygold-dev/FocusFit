import Button from '@/src/components/ui/Button';
import { useAuth, useTheme } from '@/src/providers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginFormStyles } from './styles';

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export default function LoginForm({ onNavigateToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginWithGoogle, loginWithApple, error, clearError } = useAuth();
  const { theme } = useTheme();
  const styles = loginFormStyles(theme);
  const router = useRouter();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) clearError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) clearError();
  };

  const handleLogin = async () => {
    console.log('🔐 LoginForm: Login button pressed');
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    console.log('🔐 LoginForm: Attempting login with email:', email);
    setIsSubmitting(true);
    try {
      await login(email, password);
      console.log('🔐 LoginForm: Login successful');
      // Manual navigation to main app
      console.log('🔐 LoginForm: Navigating to main app');
      router.replace('/(app)');
    } catch (err) {
      console.error('🔐 LoginForm: Login failed:', err);
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
    console.log('🔐 LoginForm: Google sign-in button pressed');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      console.log('🔐 LoginForm: Google sign-in successful');
    } catch (err) {
      console.error('🔐 LoginForm: Google sign-in failed:', err);
      const errorObj = err as Error;
      Alert.alert('Google Sign-In Error', errorObj.message || 'Failed to sign in with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAppleSignIn = async () => {
    console.log('🔐 LoginForm: Apple sign-in button pressed');
    setIsSubmitting(true);
    try {
      await loginWithApple();
      console.log('🔐 LoginForm: Apple sign-in successful');
    } catch (err) {
      console.error('🔐 LoginForm: Apple sign-in failed:', err);
      const errorObj = err as Error;
      Alert.alert('Apple Sign-In Error', errorObj.message || 'Failed to sign in with Apple');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Focus Fit</Text>
        <Text style={styles.subtitle}>Quick workouts for busy people</Text>
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

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isSubmitting}>
          {isSubmitting ? (
            <Text style={styles.buttonText}>Logging in...</Text>
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
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

        {Platform.OS === 'ios' && (
          <Button
            title="Continue with Apple"
            variant="secondary"
            onPress={handleAppleSignIn}
            disabled={isSubmitting}
            style={styles.socialButton}
          />
        )}

        <TouchableOpacity onPress={handleNavigateToRegister} disabled={isSubmitting}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
