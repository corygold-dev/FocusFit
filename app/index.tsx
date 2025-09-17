import { useTheme } from '@/app/providers/ThemeProvider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ConfirmationDialog,
  SettingsButton,
  SettingsModal,
  TimerControls,
  TimerDisplay,
  TimerPresets,
  TimerSlider,
} from '@/components';
import { useUserSettings } from './providers';
import { useTimer } from './hooks';
import { timerScreenStyles } from '@/components/timerScreen/styles';

export default function TimerScreen() {
  const { theme } = useTheme();
  const styles = timerScreenStyles(theme);
  const router = useRouter();

  const [showSettings, setShowSettings] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { settings, updateSettings } = useUserSettings();

  const { secondsLeft, isRunning, progress, resetTimer, toggleTimer, setCustomDuration } = useTimer(
    {
      onComplete: () => router.push('/exercise'),
    },
  );

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
      <TimerDisplay title="Focus Timer" progress={progress} secondsLeft={secondsLeft} />
      <TimerPresets isRunning={isRunning} onSelectPreset={setCustomDuration} />
      <TimerSlider value={secondsLeft} isRunning={isRunning} onChange={setCustomDuration} />
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
    </SafeAreaView>
  );
}
