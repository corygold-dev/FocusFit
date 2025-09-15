import { View, Text, Button } from 'react-native';
import { useRouter, Href } from 'expo-router';

export default function ExerciseScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Your 2 Exercises + Stretch 💪</Text>
      <Text style={{ marginBottom: 30 }}>Video placeholders will go here</Text>
      <Button title="Back to Home" onPress={() => router.push('/' as Href)} />
    </View>
  );
}
