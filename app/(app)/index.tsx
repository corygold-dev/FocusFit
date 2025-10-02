import { timerScreenStyles } from '@/src/components/timerScreen/styles';
import { useTimer } from '@/src/hooks';
import { useBackendData, useTheme, useTimerContext, useWorkoutType } from '@/src/providers';
import { useRouter } from 'expo-router';
import { BarChart3, Settings } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AnalyticsModal,
  ConfirmationDialog,
  SettingsModal,
  TimerControls,
  TimerDisplay,
  WorkoutChoiceModal,
} from '@/src/components';
import ModalButton from '@/src/components/timerScreen/ModalButton';
import TimeModal from '@/src/components/timerScreen/TimeModal';
import Button from '@/src/components/ui/Button';
import { useUserSettings } from '@/src/providers';
import { FOCUS_PHRASES, FOCUS_PHRASE_INTERVAL, MIN_FOCUS_DURATION } from '@/src/utils/constants';

export default function TimerScreen() {
  const { theme } = useTheme();
  const styles = timerScreenStyles(theme);
  const router = useRouter();
  const { shouldAutoStart, clearAutoStart, selectedFocusTime } = useTimerContext();

  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showWorkoutChoice, setShowWorkoutChoice] = useState(false);
  const [encouragingMessageIndex, setEncouragingMessageIndex] = useState(0);

  const { settings, saveUserSettings } = useUserSettings();

  const needsOnboarding = !settings?.lastFocusTime;

  useEffect(() => {
    if (needsOnboarding) {
      router.replace('/(app)/onboarding');
    }
  }, [needsOnboarding, router]);
  const {
    saveUserProgress,
    saveFocusSession: saveFocusSessionToDB,
    getUserProgress,
  } = useBackendData();
  const hasSavedFocusRef = useRef(false);
  const focusStartTimeRef = useRef<number | null>(null);

  const saveFocusSession = useCallback(async (): Promise<void> => {
    if (hasSavedFocusRef.current) return;

    try {
      hasSavedFocusRef.current = true;

      const actualFocusDuration = focusStartTimeRef.current
        ? Math.max(0, Math.floor((Date.now() - focusStartTimeRef.current) / 1000))
        : 0;

      if (actualFocusDuration < MIN_FOCUS_DURATION) return;

      const sessionId = `focus_${Date.now()}`;
      const completedAt = new Date();

      await saveFocusSessionToDB({
        sessionId,
        duration: actualFocusDuration,
        completedAt,
      });

      const currentProgress = await getUserProgress();
      if (currentProgress) {
        await saveUserProgress({
          lastFocusSessionDate: completedAt,
        });
      }
    } catch (error) {
      console.error('Error saving focus session:', error);
      hasSavedFocusRef.current = false;
    }
  }, [saveFocusSessionToDB, saveUserProgress, getUserProgress]);

  const handleFocusComplete = useCallback(async (): Promise<void> => {
    await saveFocusSession();
    setShowWorkoutChoice(true);
  }, [saveFocusSession, setShowWorkoutChoice]);

  const { setWorkoutType } = useWorkoutType();

  const handleChooseStrength = useCallback((): void => {
    setShowWorkoutChoice(false);
    setWorkoutType('strength');
    router.push('/exercise');
  }, [router, setWorkoutType, setShowWorkoutChoice]);

  const handleChooseMobility = useCallback((): void => {
    setShowWorkoutChoice(false);
    setWorkoutType('mobility');
    router.push('/exercise');
  }, [router, setWorkoutType, setShowWorkoutChoice]);

  const { secondsLeft, isRunning, progress, resetTimer, toggleTimer, setCustomDuration } = useTimer(
    {
      onComplete: handleFocusComplete,
      initialDuration: selectedFocusTime ? selectedFocusTime * 60 : undefined,
    },
  );

  const handleResetTimer = useCallback(async (): Promise<void> => {
    await resetTimer();
    focusStartTimeRef.current = null;
    hasSavedFocusRef.current = false;
  }, [resetTimer]);

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

  useEffect(() => {
    if (isRunning) {
      setEncouragingMessageIndex(Math.floor(Math.random() * FOCUS_PHRASES.length));

      const interval = setInterval(() => {
        setEncouragingMessageIndex(Math.floor(Math.random() * FOCUS_PHRASES.length));
      }, FOCUS_PHRASE_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const skipToExercise = useCallback(async (): Promise<void> => {
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
            onPress: async () => {
              if (isRunning) {
                toggleTimer();
              }
              await handleFocusComplete();
            },
          },
        ],
      );
    }
  }, [isRunning, toggleTimer, setShowConfirmDialog, handleFocusComplete]);

  const handleSkipConfirm = useCallback(async (): Promise<void> => {
    setShowConfirmDialog(false);
    if (isRunning) {
      toggleTimer();
    }
    await handleFocusComplete();
  }, [isRunning, toggleTimer, setShowConfirmDialog, handleFocusComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <ModalButton
        onPress={() => setShowAnalytics(true)}
        icon={<BarChart3 size={32} color={theme.colors.primary} />}
        accessibilityLabel="Open analytics"
        position="left"
      />
      <ModalButton
        onPress={() => setShowSettings(true)}
        icon={<Settings size={32} color={theme.colors.primary} />}
        accessibilityLabel="Open settings"
        position="right"
      />
      <TimerDisplay title="Focus" progress={progress} secondsLeft={secondsLeft} />

      <TimerControls
        isRunning={isRunning}
        onToggle={toggleTimer}
        onReset={handleResetTimer}
        onSkip={skipToExercise}
      />

      <View style={styles.timeButtonContainer}>
        {isRunning ? (
          <View style={[styles.timeButton, styles.focusPhraseContainer]}>
            <Text style={[styles.focusPhraseText, { color: theme.colors.text }]}>
              {FOCUS_PHRASES[encouragingMessageIndex]}
            </Text>
          </View>
        ) : (
          <Button
            title="Change focus time"
            variant="secondary"
            onPress={() => setShowTimeModal(true)}
            style={styles.timeButton}
          />
        )}
      </View>

      <AnalyticsModal visible={showAnalytics} onClose={() => setShowAnalytics(false)} />

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
          saveUserSettings({
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
        onChange={async (minutes: number) => {
          setCustomDuration(minutes);
          if (settings) {
            await saveUserSettings({ lastFocusTime: minutes * 60 });
          }
        }}
      />

      <WorkoutChoiceModal
        visible={showWorkoutChoice}
        onChooseStrength={handleChooseStrength}
        onChooseMobility={handleChooseMobility}
      />
    </SafeAreaView>
  );
}
