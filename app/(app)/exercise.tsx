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
import { useTheme, useTimerContext, useUserSettings, useWorkoutType } from '@/src/providers';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function ExerciseScreen() {
  const router = useRouter();
  const { workoutType, clearWorkoutType } = useWorkoutType();
  const { settings } = useUserSettings();
  const { theme } = useTheme();
  const { setSelectedFocusTime } = useTimerContext();
  const styles = exerciseScreenStyles(theme);

  useEffect(() => {
    return () => {
      clearWorkoutType();
    };
  }, [clearWorkoutType]);

  const {
    phase,
    currentExercise,
    secondsLeft,
    progress,
    isLoading,
    error,
    startCountdown,
    skipExercise,
    shuffleExercise,
    restartExercise,
  } = useWorkout({
    settings: settings || { difficulty: 'medium', equipment: [], excludedExercises: [] },
    workoutType: workoutType || 'strength',
  });

  const handleReturnHome = () => {
    if (settings?.lastFocusTime) {
      const minutes = settings.lastFocusTime / 60;
      setSelectedFocusTime(minutes);
    }
    router.replace('/');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onReturnHome={handleReturnHome} />;
  }

  return (
    <View style={styles.container}>
      {phase === 'preview' && (
        <PreviewPhase
          exerciseName={currentExercise}
          onStart={startCountdown}
          onShuffle={shuffleExercise}
          onExit={handleReturnHome}
        />
      )}

      {phase === 'countdown' && <CountdownPhase secondsLeft={secondsLeft} />}

      {phase === 'active' && (
        <ActivePhase
          exerciseName={currentExercise}
          secondsLeft={secondsLeft}
          progress={progress}
          onSkip={skipExercise}
          onRestart={restartExercise}
          onExit={handleReturnHome}
        />
      )}

      {phase === 'completed' && (
        <CompletedPhase
          onReturnHome={handleReturnHome}
          onSetFocusTime={setSelectedFocusTime}
          previousFocusTime={settings?.lastFocusTime ? settings.lastFocusTime / 60 : undefined}
        />
      )}
    </View>
  );
}
