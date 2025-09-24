import AsyncStorage from '@react-native-async-storage/async-storage';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

export function configureMobileAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_XxpLzVvNi',
        userPoolClientId: '32rovkftbi8fcb2pu7b9f0rmjo',
        identityPoolId: 'us-east-1:350f000d-8584-4ba8-b739-309e0df2594b',
        loginWith: {
          email: true,
          username: true,
        },
      },
    },
    Storage: {
      S3: {
        bucket: '2minfit-videos',
        region: 'us-east-1',
      },
    },
  });

  cognitoUserPoolsTokenProvider.setKeyValueStorage(AsyncStorage);
}
