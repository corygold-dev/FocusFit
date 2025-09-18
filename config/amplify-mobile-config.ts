// config/amplify-mobile-config.ts
import { Amplify } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

export function configureMobileAmplify() {
  // Basic configuration without additional options that might cause issues
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_XxpLzVvNi',
        userPoolClientId: '32rovkftbi8fcb2pu7b9f0rmjo',
        // Omit other options that might cause compatibility issues
      },
    },
  });

  // Set token storage explicitly
  cognitoUserPoolsTokenProvider.setKeyValueStorage(AsyncStorage);
}
