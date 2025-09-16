import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import * as Progress from 'react-native-progress';
import { useRouter, Href } from 'expo-router';
import { formatTime } from '@/utils/formatTime';
import { DEFAULT_MINUTES, ONE_SECOND, PRESET_MINUTES, SLIDER } from '@/utils/constants';
import { useSounds } from './providers/SoundProvider';
import { cancelNotification, scheduleTimerNotification } from '@/utils/notifications';
import SettingsModal from '@/components/SettingsModal';

export default function TimerScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(DEFAULT_MINUTES * 60);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationIdRef = useRef<string | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const { playEndSound } = useSounds();

  const startTimer = async (newDuration?: number) => {
    const time = newDuration ?? secondsLeft;
    endTimeRef.current = Date.now() + time * ONE_SECOND;

    setIsRunning(true);

    if (endTimeRef.current) {
      const triggerDate = new Date(endTimeRef.current);
      notificationIdRef.current = await scheduleTimerNotification(triggerDate);
    }
  };

  const pauseTimer = async () => {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (notificationIdRef.current) {
      await cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }

    if (endTimeRef.current) {
      const remaining = Math.max(Math.ceil((endTimeRef.current - Date.now()) / ONE_SECOND), 0);
      setSecondsLeft(remaining);
      endTimeRef.current = null;
    }
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setSecondsLeft(duration);
    endTimeRef.current = null;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (notificationIdRef.current) {
      await cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning || !endTimeRef.current) return;

    intervalRef.current = setInterval(() => {
      if (!endTimeRef.current) return;

      const remaining = Math.max(Math.ceil((endTimeRef.current - Date.now()) / ONE_SECOND), 0);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setIsRunning(false);
        playEndSound();
        router.push('/exercise' as Href);
      }
    }, ONE_SECOND);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, playEndSound, router]);

  const toggleTimer = () => {
    if (isRunning) pauseTimer();
    else startTimer();
  };

  const progress = 1 - secondsLeft / duration;

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.cogButton}>
          <Settings size={32} color="#2575fc" />
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={styles.title}>Focus Timer</Text>

      <Progress.Circle
        progress={progress}
        size={200}
        showsText
        formatText={() => formatTime(secondsLeft)}
        thickness={12}
        color="#2575fc"
        unfilledColor="#eee"
      />

      <View style={styles.presets}>
        {PRESET_MINUTES.map((min) => (
          <Text
            key={min}
            style={[styles.presetButton, isRunning && { opacity: 0.4, color: '#aaa' }]}
            onPress={() => {
              if (!isRunning) {
                setDuration(min * 60);
                setSecondsLeft(min * 60);
                endTimeRef.current = null;
              }
            }}
          >
            {min} min
          </Text>
        ))}
      </View>

      <Slider
        style={{ width: 250, height: 40 }}
        minimumValue={SLIDER.MIN}
        maximumValue={SLIDER.MAX}
        step={SLIDER.STEP}
        value={secondsLeft / 60}
        onValueChange={(value) => {
          if (!isRunning) {
            const newSeconds = value * 60;
            setDuration(newSeconds);
            setSecondsLeft(newSeconds);
            endTimeRef.current = null;
          }
        }}
        minimumTrackTintColor={isRunning ? '#ccc' : '#2575fc'}
        maximumTrackTintColor={isRunning ? '#eee' : '#eee'}
        disabled={isRunning}
      />

      <View style={styles.buttonContainer}>
        <Button title={isRunning ? 'Pause' : 'Start'} onPress={toggleTimer} />
        <Button title="Reset" onPress={resetTimer} />
        <Button title="Skip" onPress={() => router.push('/exercise' as Href)} />
      </View>

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        initialEquipment={equipment}
        initialDifficulty={difficulty}
        onSave={({ equipment, difficulty }) => {
          setEquipment(equipment);
          setDifficulty(difficulty);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 30 },
  header: {
    width: '100%',
    position: 'absolute',
    top: 10,
    right: 20,
    alignItems: 'flex-end',
  },
  cogButton: {
    padding: 8,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  presets: { flexDirection: 'row', gap: 20, marginVertical: 20 },
  presetButton: { fontSize: 18, color: '#2575fc', fontWeight: '600' },
});
