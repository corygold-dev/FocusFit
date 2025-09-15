// app/exercise.tsx
import { useAudioPlayer } from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import endSoundFile from '../assets/audio/finish-sound.wav';
import smallBeepFile from '../assets/audio/short-beep.wav';
import finalBeepFile from '../assets/audio/short-ping.mp3';
import { Exercise } from './lib/exercises';
import { pickWorkout } from './utils/pickWorkout';
import { formatTime } from './utils/formatTime';

type Phase = 'preview' | 'countdown' | 'active';

export default function ExerciseScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('preview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentList, setCurrentList] = useState<Exercise[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const smallBeep = useAudioPlayer(smallBeepFile);
  const finalBeep = useAudioPlayer(finalBeepFile);
  const endSound = useAudioPlayer(endSoundFile);

  useEffect(() => {
    const workout = pickWorkout();
    setCurrentList(workout);
  }, []);

  useEffect(() => {
    if (phase === 'countdown') {
      if (secondsLeft > 0) smallBeep.play();
      else if (secondsLeft === 0) finalBeep.play();

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    if (phase === 'active') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [finalBeep, phase, secondsLeft, smallBeep]);

  useEffect(() => {
    if (phase === 'countdown' && secondsLeft === 0) {
      const isStretch = currentList[currentIndex].category === 'stretch';
      const duration = isStretch ? 60 : 30;
      setSecondsLeft(duration);
      setTotalDuration(duration);
      setPhase('active');
    }

    if (phase === 'active' && secondsLeft === 0) {
      endSound.play();
      if (currentIndex < currentList.length - 1) {
        setCurrentIndex((i) => i + 1);
        setPhase('preview');
      } else {
        router.replace('/timer');
      }
    }
  }, [secondsLeft, phase, currentIndex, currentList, endSound, router]);

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
});
