import { useAuth } from '@/src/providers/AuthProvider';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { loginFormStyles } from './styles';
import { useTheme } from '@/src/providers';
import { testAmplifyAuth } from '@/src/utils/testAuth';
import { directCognitoLogin } from '@/src/utils/directCognito';
import { useRouter } from 'expo-router';

interface LoginFormProps {
  onNavigateToRegister: () => void;
}

export default function LoginForm({ onNavigateToRegister }: LoginFormProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError } = useAuth();
  const router = useRouter();
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
        <Text style={styles.title}>2 Minute Fit</Text>
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

      {Platform.OS !== 'web' && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>Troubleshooting Options</Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#FF9800',
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={async () => {
              try {
                // Explicitly log values before calling test function
                console.log('Test button pressed with:', {
                  email: emailOrPhone,
                  passwordLength: password?.length || 0,
                });

                if (!emailOrPhone || !password) {
                  Alert.alert('Missing Data', 'Please enter both email and password');
                  return;
                }

                const result = await testAmplifyAuth(emailOrPhone, password);
                console.log('Test auth result:', result);

                Alert.alert(
                  'Auth Test Result',
                  result.success
                    ? 'Authentication successful!'
                    : `Auth failed: ${JSON.stringify(result).substring(0, 100)}`,
                  [{ text: 'OK' }],
                );

                if (result.success) {
                  // If successful, you could trigger navigation or login state update
                  Alert.alert('Success', 'Test login successful!');
                }
              } catch (e) {
                console.error('Test button error:', e);
                Alert.alert('Test Error', String(e));
              }
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Test Auth (Debug)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
            onPress={async () => {
              try {
                console.log('Trying direct Cognito login');

                if (!emailOrPhone || !password) {
                  Alert.alert('Missing Data', 'Please enter both email and password');
                  return;
                }

                const result = await directCognitoLogin(emailOrPhone, password);
                console.log('Direct Cognito result:', result);

                if (result.success) {
                  Alert.alert('Login Successful', 'You have been logged in successfully!', [
                    {
                      text: 'Continue',
                      onPress: () => {
                        // Navigate to the app
                        router.replace('/(app)');
                      },
                    },
                  ]);
                } else {
                  Alert.alert('Login Failed', JSON.stringify(result));
                }
              } catch (e) {
                console.error('Direct Cognito error:', e);
                Alert.alert('Login Error', String(e));
              }
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Direct Cognito Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
