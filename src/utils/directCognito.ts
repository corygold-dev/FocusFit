import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cognito configuration
const poolData = {
  UserPoolId: 'us-east-1_XxpLzVvNi',
  ClientId: '32rovkftbi8fcb2pu7b9f0rmjo',
};

// Create the user pool
const userPool = new CognitoUserPool(poolData);

export async function directCognitoLogin(username: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log('Direct Cognito login attempt for:', username);

    // Create a Cognito user
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    // Create authentication details
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authDetails = new AuthenticationDetails(authenticationData);

    // Authenticate user
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('Direct Cognito login success!');
        // Get the tokens
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();

        // Store tokens in AsyncStorage
        AsyncStorage.setItem('accessToken', accessToken);
        AsyncStorage.setItem('idToken', idToken);
        AsyncStorage.setItem('username', username);

        // Resolve with user data
        resolve({
          success: true,
          username,
          accessToken,
          idToken,
        });
      },

      onFailure: (err) => {
        console.log('Direct Cognito login failure:', err);
        reject(err);
      },

      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('New password required');
        // Handle new password required scenario
        resolve({
          success: false,
          newPasswordRequired: true,
        });
      },
    });
  });
}

export async function checkDirectCognitoAuth(): Promise<boolean> {
  try {
    // Check if we have tokens stored
    const accessToken = await AsyncStorage.getItem('accessToken');
    const idToken = await AsyncStorage.getItem('idToken');

    return !!accessToken && !!idToken;
  } catch (error) {
    console.error('Error checking auth:', error);
    return false;
  }
}

export async function directCognitoLogout(): Promise<void> {
  try {
    // Get current user
    const username = await AsyncStorage.getItem('username');
    if (username) {
      const userData = {
        Username: username,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);

      // Sign out
      cognitoUser.signOut();
    }

    // Clear tokens
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('idToken');
    await AsyncStorage.removeItem('username');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
