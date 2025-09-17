import { ONE_SECOND } from '@/utils/constants';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { formatTime } from '../utils/formatTime';
import { pickWorkout } from '../utils/pickWorkout';
import { Exercise } from './lib/exercises';
import { useSounds } from './providers/SoundProvider';
import { useUserSettings } from './providers/UserSettingsProvider';
import { useInterval } from './hooks/useInterval';

type Phase = 'preview' | 'countdown' | 'active' | 'completed';

export default function ExerciseScreen() {
  const router = useRouter();
  const { settings } = useUserSettings();

  const [phase, setPhase] = useState<Phase>('preview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentList, setCurrentList] = useState<Exercise[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { playSmallBeep, playFinalBeep, playEndSound } = useSounds();

  const isTimerActive = phase === 'countdown' || phase === 'active';
  useInterval(
    () => {
      setSecondsLeft((prev) => prev - 1);
    },
    isTimerActive ? ONE_SECOND : null,
  );

  useEffect(() => {
    try {
      setIsLoading(true);
      const workout = pickWorkout(settings);
      if (workout.length === 0) {
        setError('No exercises available with current settings');
      } else {
        setCurrentList(workout);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load workout');
      console.error('Workout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    if (phase === 'countdown') {
      if (secondsLeft > 0) playSmallBeep();
      else if (secondsLeft === 0) playFinalBeep();
    }
  }, [phase, secondsLeft, playSmallBeep, playFinalBeep]);

  useEffect(() => {
    if (secondsLeft !== 0) return;

    if (phase === 'countdown') {
      const duration = currentList[currentIndex]?.duration || 30;
      setSecondsLeft(duration);
      setTotalDuration(duration);
      setPhase('active');
    } else if (phase === 'active') {
      playEndSound();
      if (currentIndex < currentList.length - 1) {
        setCurrentIndex((i) => i + 1);
        setPhase('preview');
      } else {
        setPhase('completed');
        setTimeout(() => router.replace('/'), 2000);
      }
    }
  }, [secondsLeft, phase, currentIndex, currentList, router, playEndSound]);

  const startCountdown = () => {
    setSecondsLeft(3);
    setTotalDuration(3);
    setPhase('countdown');
  };

  const currentExercise = useMemo(
    () => currentList[currentIndex]?.name ?? '',
    [currentList, currentIndex],
  );

  const progress = totalDuration > 0 ? (totalDuration - secondsLeft) / totalDuration : 0;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2575fc" />
        <Text style={styles.loadingText}>Loading your workout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Return Home"
          onPress={() => router.replace('/')}
          accessibilityLabel="Return to home screen"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {phase === 'preview' && (
        <>
          <Text style={styles.title}>Next up:</Text>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoText}>Video Preview</Text>
          </View>
          <Text style={styles.exercise}>{currentExercise}</Text>
          <Button
            title="Start exercise"
            onPress={startCountdown}
            accessibilityLabel={`Start ${currentExercise} exercise`}
          />
        </>
      )}

      {phase === 'countdown' && (
        <>
          <Text style={styles.title}>Get ready...</Text>
          <Text style={styles.timer} accessibilityLabel={`${secondsLeft} seconds until start`}>
            {formatTime(secondsLeft)}
          </Text>
        </>
      )}

      {phase === 'active' && (
        <>
          <Text style={styles.title}>{currentExercise}</Text>
          <Text style={styles.timer} accessibilityLabel={`${secondsLeft} seconds remaining`}>
            {formatTime(secondsLeft)}
          </Text>
          <Progress.Bar
            progress={progress}
            width={200}
            height={12}
            accessibilityLabel={`Progress: ${Math.round(progress * 100)}%`}
          />
        </>
      )}

      {phase === 'completed' && (
        <>
          <Text style={styles.title}>Workout Complete!</Text>
          <Text style={styles.completedText}>Great job!</Text>
          <ActivityIndicator size="small" color="#2575fc" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerContent: {
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exercise: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 40,
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
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
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  errorText: {
    fontSize: 20,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  completedText: {
    fontSize: 24,
    color: '#43a047',
    marginBottom: 30,
  },
});
