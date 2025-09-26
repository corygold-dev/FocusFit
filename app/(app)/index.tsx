import { timerScreenStyles } from '@/src/components/timerScreen/styles';
import { useTimer } from '@/src/hooks';
import { useBackendData, useTheme, useTimerContext } from '@/src/providers';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ConfirmationDialog,
  SettingsButton,
  SettingsModal,
  TimerControls,
  TimerDisplay,
} from '@/src/components';
import TimeModal from '@/src/components/timerScreen/TimeModal';
import Button from '@/src/components/ui/Button';
import { useUserSettings } from '@/src/providers';

export default function TimerScreen() {
  const { theme } = useTheme();
  const styles = timerScreenStyles(theme);
  const router = useRouter();
  const { shouldAutoStart, clearAutoStart, selectedFocusTime } = useTimerContext();

  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const { settings, updateSettings } = useUserSettings();
  const { saveUserProgress } = useBackendData();
  const hasSavedFocusRef = useRef(false);
  const focusStartTimeRef = useRef<number | null>(null);

  const saveFocusSession = useCallback(async () => {
    if (hasSavedFocusRef.current) return;

    try {
      hasSavedFocusRef.current = true;

      const actualFocusDuration = focusStartTimeRef.current
        ? Math.max(0, Math.floor((Date.now() - focusStartTimeRef.current) / 1000))
        : 0;

      await saveUserProgress({
        totalWorkouts: 0,
        totalWorkoutDuration: 0,
        lastWorkoutDate: undefined,
        totalFocusSessions: 1,
        totalFocusDuration: actualFocusDuration,
        lastFocusSessionDate: new Date(),
        achievements: [],
      });
    } catch (error) {
      console.error('Error saving focus session:', error);
      hasSavedFocusRef.current = false;
    }
  }, [saveUserProgress]);

  const handleFocusComplete = useCallback(async () => {
    await saveFocusSession();
    router.push('/exercise');
  }, [saveFocusSession, router]);

  const { secondsLeft, isRunning, progress, resetTimer, toggleTimer, setCustomDuration } = useTimer(
    {
      onComplete: handleFocusComplete,
      initialDuration: selectedFocusTime ? selectedFocusTime * 60 : undefined,
    },
  );

  const handleResetTimer = async () => {
    await resetTimer();
    focusStartTimeRef.current = null;
    hasSavedFocusRef.current = false;
  };

  useEffect(() => {
    if (shouldAutoStart && !isRunning) {
      toggleTimer();
      clearAutoStart();
    }
  }, [shouldAutoStart, isRunning, toggleTimer, clearAutoStart]);

  useEffect(() => {
    if (isRunning) {
      hasSavedFocusRef.current = false;
      focusStartTimeRef.current = Date.now();
    }
  }, [isRunning]);

  const skipToExercise = async () => {
    if (isRunning) {
      toggleTimer();
    }

    if (Platform.OS === 'web') {
      setShowConfirmDialog(true);
    } else {
      Alert.alert(
        'Skip Timer',
        'Are you sure you want to skip the timer and go directly to exercises?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Skip', onPress: handleFocusComplete },
        ],
      );
    }
  };

  const handleSkipConfirm = () => {
    setShowConfirmDialog(false);
    handleFocusComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SettingsButton onPress={() => setShowSettings(true)} />
      <TimerDisplay title="Focus" progress={progress} secondsLeft={secondsLeft} />

      <View style={styles.timeButtonContainer}>
        <Button
          title="Change focus time"
          variant="secondary"
          onPress={() => setShowTimeModal(true)}
          style={[styles.timeButton, { opacity: isRunning ? 0 : 1 }]}
          disabled={isRunning}
        />
      </View>

      <TimerControls
        isRunning={isRunning}
        onToggle={toggleTimer}
        onReset={handleResetTimer}
        onSkip={skipToExercise}
      />
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        initialEquipment={settings?.equipment || []}
        initialDifficulty={settings?.difficulty || 'medium'}
        initialExcludedExercises={settings?.excludedExercises || []}
        initialMorningReminders={settings?.morningReminders ?? true}
        initialAfternoonReminders={settings?.afternoonReminders ?? true}
        initialTimerEndNotifications={settings?.timerEndNotifications ?? true}
        onSave={({
          equipment,
          difficulty,
          excludedExercises,
          theme,
          morningReminders,
          afternoonReminders,
          timerEndNotifications,
        }) => {
          updateSettings({
            equipment,
            difficulty,
            excludedExercises,
            theme,
            morningReminders,
            afternoonReminders,
            timerEndNotifications,
          });
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

      <TimeModal
        visible={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        secondsLeft={secondsLeft}
        isRunning={isRunning}
        onChange={setCustomDuration}
      />
    </SafeAreaView>
  );
}
