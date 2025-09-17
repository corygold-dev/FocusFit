import { useInterval } from '@/app/hooks/useInterval';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import SettingsModal from '@/components/SettingsModal';
import { cleanupTimerResources } from '@/utils/cleanupTimerResources';
import { DEFAULT_MINUTES, ONE_SECOND, PRESET_MINUTES, SLIDER } from '@/utils/constants';
import { formatTime } from '@/utils/formatTime';
import { scheduleTimerNotification } from '@/utils/notifications';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSounds } from './providers/SoundProvider';
import { useUserSettings } from './providers/UserSettingsProvider';

export default function TimerScreen() {
  const router = useRouter();
  const [duration, setDuration] = useState(DEFAULT_MINUTES * 60);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { settings, updateSettings } = useUserSettings();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationIdRef = useRef<string | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const { playEndSound } = useSounds();

  const progress = useMemo(() => 1 - secondsLeft / duration, [secondsLeft, duration]);

  const startTimer = async (newDuration?: number) => {
    const time = newDuration ?? secondsLeft;
    endTimeRef.current = Date.now() + time * ONE_SECOND;

    setIsRunning(true);

    if (endTimeRef.current) {
      const triggerDate = new Date(endTimeRef.current);
      try {
        notificationIdRef.current = await scheduleTimerNotification(triggerDate);
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }
  };

  const pauseTimer = async () => {
    setIsRunning(false);

    await cleanupTimerResources(intervalRef, notificationIdRef);

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

    await cleanupTimerResources(intervalRef, notificationIdRef);
  };

  const toggleTimer = () => {
    if (isRunning) pauseTimer();
    else startTimer();
  };

  const skipToExercise = async () => {
    if (isRunning) {
      setIsRunning(false);
      await cleanupTimerResources(intervalRef, notificationIdRef);
    }

    if (Platform.OS === 'web') {
      setShowConfirmDialog(true);
    } else {
      Alert.alert(
        'Skip Timer',
        'Are you sure you want to skip the timer and go directly to exercises?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Skip',
            onPress: () => router.push('/exercise'),
          },
        ],
      );
    }
  };

  const handleSkipConfirm = () => {
    setShowConfirmDialog(false);
    router.push('/exercise');
  };

  useInterval(
    () => {
      if (!endTimeRef.current) return;

      const remaining = Math.max(Math.ceil((endTimeRef.current - Date.now()) / ONE_SECOND), 0);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setIsRunning(false);
        playEndSound();
        router.push('/exercise');
      }
    },
    isRunning ? ONE_SECOND : null,
  );

  useEffect(() => {
    return () => {
      cleanupTimerResources(intervalRef, notificationIdRef);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowSettings(true)}
          style={styles.cogButton}
          accessibilityLabel="Open settings"
          accessibilityRole="button"
        >
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
          <TouchableOpacity
            key={min}
            style={[styles.presetButton, isRunning && styles.presetButtonDisabled]}
            disabled={isRunning}
            accessibilityLabel={`Set timer to ${min} minutes`}
            accessibilityRole="button"
            onPress={() => {
              if (!isRunning) {
                setDuration(min * 60);
                setSecondsLeft(min * 60);
                endTimeRef.current = null;
              }
            }}
          >
            <Text style={[styles.presetButtonText, isRunning && styles.presetButtonTextDisabled]}>
              {min} min
            </Text>
          </TouchableOpacity>
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
        accessibilityLabel={`Adjust timer duration, currently ${Math.floor(secondsLeft / 60)} minutes`}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isRunning ? 'Pause' : 'Start'}
          onPress={toggleTimer}
          accessibilityLabel={isRunning ? 'Pause timer' : 'Start timer'}
        />
        <Button title="Reset" onPress={resetTimer} accessibilityLabel="Reset timer" />
        <Button
          title="Skip"
          onPress={skipToExercise}
          accessibilityLabel="Skip timer and go to exercises"
        />
      </View>

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        initialEquipment={settings.equipment}
        initialDifficulty={settings.difficulty}
        initialExcludedExercises={settings.excludedExercises}
        onSave={({ equipment, difficulty, excludedExercises }) => {
          updateSettings({ equipment, difficulty, excludedExercises });
        }}
      />

      <ConfirmationDialog
        visible={showConfirmDialog}
        title="Skip Timer"
        message="Are you sure you want to skip the timer and go directly to exercises?"
        confirmText="Skip"
        cancelText="Cancel"
        onConfirm={handleSkipConfirm}
        onCancel={() => setShowConfirmDialog(false)}
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
  presetButton: {
    padding: 10,
    borderRadius: 8,
  },
  presetButtonDisabled: {
    opacity: 0.4,
  },
  presetButtonText: {
    fontSize: 18,
    color: '#2575fc',
    fontWeight: '600',
  },
  presetButtonTextDisabled: {
    color: '#aaa',
  },
});
