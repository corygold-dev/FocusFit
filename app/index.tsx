import { View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/src/providers';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    //TODO Create loading spinner
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/sign-in" />;
}
