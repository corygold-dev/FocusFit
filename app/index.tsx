import { View, Text, Button } from 'react-native';
import { useRouter, Href } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 30 }}>2 Minute Fit</Text>
      <Button title="Start Focus Timer" onPress={() => router.push('/timer' as Href)} />
    </View>
  );
}
