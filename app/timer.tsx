import { View, Text, Button } from 'react-native';
import { useRouter, Href } from 'expo-router';

export default function TimerScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Focus Timer ⏱️</Text>
      <Text style={{ marginBottom: 30 }}>Timer logic goes here (countdown, pause, reset)</Text>
      <Button title="End Timer → Exercises" onPress={() => router.push('/exercise' as Href)} />
    </View>
  );
}
