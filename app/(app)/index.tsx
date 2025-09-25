import { timerScreenStyles } from '@/src/components/timerScreen/styles';
import { useTimer } from '@/src/hooks';
import { useTheme, useTimerContext } from '@/src/providers';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

  const { secondsLeft, isRunning, progress, resetTimer, toggleTimer, setCustomDuration } = useTimer(
    {
      onComplete: () => router.push('/exercise'),
      initialDuration: selectedFocusTime ? selectedFocusTime * 60 : undefined,
    },
  );

  useEffect(() => {
    if (shouldAutoStart && !isRunning) {
      toggleTimer();
      clearAutoStart();
    }
  }, [shouldAutoStart, isRunning, toggleTimer, clearAutoStart]);

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
        onReset={resetTimer}
        onSkip={skipToExercise}
      />
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
