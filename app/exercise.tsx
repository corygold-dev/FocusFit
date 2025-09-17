import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from './providers/ThemeProvider';
import { createStyles } from '@/components/exerciseScreen/styles/exerciseScreen.styles';
import {
  ActivePhase,
  CompletedPhase,
  CountdownPhase,
  ErrorState,
  LoadingState,
  PreviewPhase,
} from '@/components';
import { useWorkout } from './hooks';
import { useUserSettings } from './providers';

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
