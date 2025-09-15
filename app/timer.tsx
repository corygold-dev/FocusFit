import { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import _ from 'lodash';

const TIMER_DURATION = 5;

export default function TimerScreen() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(TIMER_DURATION);
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setIsRunning(false);
      router.push('/exercise' as Href);
    }
  }, [secondsLeft, router]);

  const formatTime = (seconds: number) => {
    const minutes = _.padStart(String(Math.floor(seconds / 60)), 2, '0');
    const secs = _.padStart(String(seconds % 60), 2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Focus Timer</Text>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      <View style={styles.buttonContainer}>
        <Button title={isRunning ? 'Pause' : 'Start'} onPress={toggleTimer} />
        <Button title="Reset" onPress={resetTimer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  timer: { fontSize: 48, fontWeight: 'bold', marginBottom: 30 },
  buttonContainer: { flexDirection: 'row', gap: 20 },
});
