import { useAuth } from '@/src/providers/AuthProvider';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { loginFormStyles } from './styles';
import { useTheme } from '@/src/providers';

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export default function LoginForm({ onNavigateToRegister }: LoginFormProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError } = useAuth();
  const { theme } = useTheme();
  const styles = loginFormStyles(theme);

  const handleEmailOrPhoneChange = (text: string) => {
    setEmailOrPhone(text);
    if (error) clearError();
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) clearError();
  };

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please enter both email/phone and password');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(emailOrPhone, password);
    } catch (err) {
      const errorObj = err as Error;
      Alert.alert('Login Error', errorObj.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToRegister = () => {
    clearError();
    onNavigateToRegister();
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
          placeholder="Email or Phone"
          placeholderTextColor={theme.colors.text + '80'}
          value={emailOrPhone}
          onChangeText={handleEmailOrPhoneChange}
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNavigateToRegister} disabled={isSubmitting}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
