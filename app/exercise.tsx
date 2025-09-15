import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { Exercise } from './lib/exercises';
import { pickWorkout } from '../utils/pickWorkout';
import { formatTime } from '../utils/formatTime';
import { ONE_SECOND } from '@/utils/constants';
import { useSounds } from './providers/SoundProvider';

type Phase = 'preview' | 'countdown' | 'active';

export default function ExerciseScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('preview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentList, setCurrentList] = useState<Exercise[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { playSmallBeep, playFinalBeep, playEndSound } = useSounds();

  useEffect(() => {
    const workout = pickWorkout();
    setCurrentList(workout);
  }, []);

  useEffect(() => {
    if (phase === 'countdown') {
      if (secondsLeft > 0) playSmallBeep();
      else if (secondsLeft === 0) playFinalBeep();

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, ONE_SECOND);
    }

    if (phase === 'active') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, ONE_SECOND);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, playFinalBeep, playSmallBeep, secondsLeft]);

  useEffect(() => {
    if (phase === 'countdown' && secondsLeft === 0) {
      const duration = currentList[currentIndex].duration;
      setSecondsLeft(duration);
      setTotalDuration(duration);
      setPhase('active');
    }

    if (phase === 'active' && secondsLeft === 0) {
      playEndSound();
      if (currentIndex < currentList.length - 1) {
        setCurrentIndex((i) => i + 1);
        setPhase('preview');
      } else {
        router.replace('/');
      }
    }
  }, [secondsLeft, phase, currentIndex, currentList, router, playEndSound]);

  const startCountdown = () => {
    setSecondsLeft(3);
    setTotalDuration(3);
    setPhase('countdown');
  };

  const currentExercise = currentList[currentIndex]?.name ?? '';
  const progress = totalDuration > 0 ? (totalDuration - secondsLeft) / totalDuration : 0;

  return (
    <View style={styles.container}>
      {phase === 'preview' && (
        <>
          <Text style={styles.title}>Next up:</Text>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoText}>Video Preview</Text>
          </View>
          <Text style={styles.exercise}>{currentExercise}</Text>
          <Button title="Start exercise" onPress={startCountdown} />
        </>
      )}
      {phase === 'countdown' && (
        <>
          <Text style={styles.title}>Get ready...</Text>
          <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
        </>
      )}
      {phase === 'active' && (
        <>
          <Text style={styles.title}>{currentExercise}</Text>
          <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
          <Progress.Bar progress={progress} width={200} height={12} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  exercise: { fontSize: 32, fontWeight: '600', marginBottom: 40 },
  timer: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
  videoPlaceholder: {
    width: 300,
    height: 180,
    backgroundColor: '#eee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
});
