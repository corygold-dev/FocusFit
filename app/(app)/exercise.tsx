import {
  ActivePhase,
  CompletedPhase,
  CountdownPhase,
  ErrorState,
  LoadingState,
  PreviewPhase,
} from '@/src/components';
import { exerciseScreenStyles } from '@/src/components/exerciseScreen/styles';
import { useWorkout } from '@/src/hooks';
import { useTheme, useUserSettings } from '@/src/providers';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function ExerciseScreen() {
  const router = useRouter();
  const { settings } = useUserSettings();
  const { theme } = useTheme();
  const styles = exerciseScreenStyles(theme);

  const {
    phase,
    currentExercise,
    secondsLeft,
    progress,
    isLoading,
    error,
    startCountdown,
    skipExercise,
    restartExercise,
  } = useWorkout({
    settings: settings || { difficulty: 'medium', equipment: [], excludedExercises: [] },
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
        <ActivePhase
          exerciseName={currentExercise}
          secondsLeft={secondsLeft}
          progress={progress}
          onSkip={skipExercise}
          onRestart={restartExercise}
        />
      )}

      {phase === 'completed' && <CompletedPhase onReturnHome={() => router.replace('/')} />}
    </View>
  );
}
