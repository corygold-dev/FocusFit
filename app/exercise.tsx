import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from './providers/ThemeProvider';
import { useUserSettings } from './providers/UserSettingsProvider';
import { useWorkout } from './hooks/useWorkout';
import { createStyles } from '@/components/exerciseScreen/styles/exerciseScreen.styles';
import PreviewPhase from '@/components/exerciseScreen/PreviewPhase';
import CountdownPhase from '@/components/exerciseScreen/CountdownPhase';
import ActivePhase from '@/components/exerciseScreen/ActivePhase';
import CompletedPhase from '@/components/exerciseScreen/CompletedPhase';
import LoadingState from '@/components/exerciseScreen/LoadingState';
import ErrorState from '@/components/exerciseScreen/ErrorState';

export default function ExerciseScreen() {
  const router = useRouter();
  const { settings } = useUserSettings();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { phase, currentExercise, secondsLeft, progress, isLoading, error, startCountdown } =
    useWorkout({
      settings,
      onComplete: () => router.replace('/'),
    });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onReturnHome={() => router.replace('/')} />;
  }

  return (
    <View style={styles.container}>
      {phase === 'preview' && (
        <PreviewPhase exerciseName={currentExercise} onStart={startCountdown} />
      )}

      {phase === 'countdown' && <CountdownPhase secondsLeft={secondsLeft} />}

      {phase === 'active' && (
        <ActivePhase exerciseName={currentExercise} secondsLeft={secondsLeft} progress={progress} />
      )}

      {phase === 'completed' && <CompletedPhase onReturnHome={() => router.replace('/')} />}
    </View>
  );
}
