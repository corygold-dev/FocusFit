import { Amplify } from 'aws-amplify';
import { Platform } from 'react-native';
import { configureMobileAmplify } from './amplify-mobile-config';

export function configureAmplify() {
  try {
    if (Platform.OS === 'web') {
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
        API: {
          GraphQL: {
            endpoint:
              'https://qu3alj6yybdyjlasujwjt5aaei.appsync-api.us-east-1.amazonaws.com/graphql',
            region: 'us-east-1',
            defaultAuthMode: 'userPool',
          },
        },
      });

      console.log('Configured Amplify for web');
    } else {
      configureMobileAmplify();
      console.log('Configured Amplify for mobile');
    }
  } catch (error) {
    console.error('Failed to configure Amplify:', error);
  }
}
