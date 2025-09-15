import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import * as Progress from 'react-native-progress';
import { useRouter, Href } from 'expo-router';
import { formatTime } from '@/utils/formatTime';
import endSoundFile from '../assets/audio/finish-sound.wav';
import { useAudioPlayer } from 'expo-audio';
import { playSound } from '@/utils/playSound';
import { DEFAULT_MINUTES, ONE_SECOND, PRESET_MINUTES, SLIDER } from '@/utils/constants';

export default function TimerScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(DEFAULT_MINUTES * 60);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const endSound = useAudioPlayer(endSoundFile);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(duration);
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => setSecondsLeft((prev) => prev - 1), ONE_SECOND);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setIsRunning(false);
      playSound(endSound);
      router.push('/exercise' as Href);
    }
  }, [secondsLeft, router, endSound]);

  const progress = 1 - secondsLeft / duration;

  return (
    <SafeAreaView style={styles.container}>
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
            style={styles.presetButton}
            onPress={() => {
              setDuration(min * 60);
              setSecondsLeft(min * 60);
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
          setDuration(value * 60);
          setSecondsLeft(value * 60);
        }}
        minimumTrackTintColor="#2575fc"
        maximumTrackTintColor="#eee"
      />

      <View style={styles.buttonContainer}>
        <Button title={isRunning ? 'Pause' : 'Start'} onPress={toggleTimer} />
        <Button title="Reset" onPress={resetTimer} />
        <Button title="Skip" onPress={() => router.push('/exercise' as Href)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 30 },
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
