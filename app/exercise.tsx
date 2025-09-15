import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import _ from 'lodash';

interface Item {
  name: string;
}

const EXERCISES: Item[] = [
  { name: 'Neck Rolls' },
  { name: 'Shoulder Shrugs' },
  { name: 'Seated Twist' },
  { name: 'Wrist Stretch' },
  { name: 'Standing Calf Raise' },
];

const STRETCHES: Item[] = [
  { name: 'Forward Fold' },
  { name: 'Chest Opener' },
  { name: 'Seated Side Stretch' },
  { name: 'Hip Flexor Stretch' },
];

export default function ExerciseScreen() {
  const router = useRouter();
  const [currentSet, setCurrentSet] = useState<{ exercises: Item[]; stretch: Item }>({
    exercises: [],
    stretch: { name: '' },
  });

  useEffect(() => {
    const exercises = _.sampleSize(EXERCISES, 2);
    const stretch = _.sample(STRETCHES)!;

    setCurrentSet({ exercises, stretch });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise Time! 💪</Text>

      {currentSet.exercises.map((exercise, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.videoPlaceholder}>
            <Text>Video Placeholder</Text>
          </View>
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.exerciseName}>{currentSet.stretch.name}</Text>
        <View style={styles.videoPlaceholder}>
          <Text>Video Placeholder</Text>
        </View>
      </View>

      <Button title="Done" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
  },
  exerciseName: { fontSize: 18, marginBottom: 10 },
  videoPlaceholder: {
    height: 100,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
