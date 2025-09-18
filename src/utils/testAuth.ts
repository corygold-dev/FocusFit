// src/utils/testAuth.ts
import { signIn, fetchUserAttributes } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Minimal configuration
const minimalConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_XxpLzVvNi',
      userPoolClientId: '32rovkftbi8fcb2pu7b9f0rmjo',
      region: 'us-east-1',
    },
  },
};

export async function testAmplifyAuth(username: string, password: string) {
  try {
    console.log('=== TEST AUTH FLOW START ===');
    console.log(
      'Input credentials - Username:',
      username,
      'Password length:',
      password?.length || 0,
    );

    // Step 1: Configure with minimal settings
    console.log('1. Configuring Amplify');
    Amplify.configure(minimalConfig);

    // Step 2: Set storage
    console.log('2. Setting token storage');
    try {
      cognitoUserPoolsTokenProvider.setKeyValueStorage(AsyncStorage);
      console.log('Token storage set successfully');
    } catch (e) {
      console.log('Error setting token storage:', e);
      // Continue anyway
    }

    // Check that username and password are provided
    if (!username) {
      console.log('Username is empty!');
      return { success: false, error: 'Username is required' };
    }

    if (!password) {
      console.log('Password is empty!');
      return { success: false, error: 'Password is required' };
    }

    // Step 3: Sign in
    console.log('3. Attempting sign in with username:', username);
    const signInResult = await signIn({
      username: username, // Make sure this is explicitly passed
      password: password, // Make sure this is explicitly passed
    });

    console.log(
      '4. Sign in result:',
      JSON.stringify({
        isSignedIn: signInResult.isSignedIn,
        nextStep: signInResult.nextStep,
      }),
    );

    // Step 4: Try getting user attributes
    if (signInResult.isSignedIn) {
      try {
        console.log('5. Getting user attributes');
        const attributes = await fetchUserAttributes();
        console.log('6. User attributes:', JSON.stringify(attributes));
        return { success: true, attributes };
      } catch (attrError) {
        console.log('Error getting attributes:', attrError);
        return { success: true, error: 'Could not get attributes' };
      }
    } else {
      return {
        success: false,
        reason: `Not signed in: ${JSON.stringify(signInResult.nextStep)}`,
      };
    }
  } catch (error) {
    console.log('=== TEST AUTH ERROR ===');
    // Try to extract as much information as possible
    const err = error as any;
    console.log('Error type:', typeof error);
    console.log('Is Error instance:', error instanceof Error);
    console.log('Error toString():', String(error));

    // Try different properties that might exist
    const errorDetails = {
      message: err.message,
      name: err.name,
      code: err.code,
      statusCode: err.statusCode,
      stack: err.stack?.substring(0, 200),
    };

    console.log('Error details:', JSON.stringify(errorDetails));

    // Check for network-related properties
    if (err.response) {
      console.log('Response error:', {
        status: err.response.status,
        data: err.response.data,
      });
    }

    return { success: false, error };
  } finally {
    console.log('=== TEST AUTH FLOW END ===');
  }
}
