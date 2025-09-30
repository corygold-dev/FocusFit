import { Exercise } from '@/src/lib/exercises';
import { useAuth, useBackendData, useSounds } from '@/src/providers';
import { TIMER } from '@/src/utils/constants';
import { pickWorkout, UserSettings } from '@/src/utils/exerciseUtils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInterval } from '../timer';

type Phase = 'preview' | 'countdown' | 'active' | 'completed';

interface UseWorkoutProps {
  settings: UserSettings;
}

export function useWorkout({ settings }: UseWorkoutProps) {
  const [phase, setPhase] = useState<Phase>('preview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentList, setCurrentList] = useState<Exercise[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasSavedWorkoutRef = useRef(false);

  const { playSmallBeep, playFinalBeep, playEndSound } = useSounds();
  const { user } = useAuth();
  const { saveUserProgress, saveWorkoutSession, getUserProgress } = useBackendData();

  const saveWorkoutData = useCallback(async () => {
    if (!user?.uid || currentList.length === 0 || hasSavedWorkoutRef.current) return;

    try {
      hasSavedWorkoutRef.current = true;

      const sessionId = `workout_${Date.now()}`;
      const exercises = currentList.map((exercise) => exercise.name);
      const duration = currentList.reduce(
        (total, exercise) => total + (exercise.duration || 30),
        0,
      );

      await saveWorkoutSession({
        sessionId,
        exercises,
        duration,
        completedAt: new Date(),
      });

      const currentProgress = await getUserProgress();
      if (currentProgress) {
        await saveUserProgress({
          totalWorkouts: currentProgress.totalWorkouts + 1,
          totalWorkoutDuration: currentProgress.totalWorkoutDuration + duration,
          lastWorkoutDate: new Date(),
        });
      }
    } catch (error) {
      console.error('Error saving workout session:', error);
      hasSavedWorkoutRef.current = false;
    }
  }, [user?.uid, currentList, saveUserProgress, saveWorkoutSession, getUserProgress]);

  useEffect(() => {
    try {
      setIsLoading(true);
      const workout = pickWorkout(settings);
      if (workout.length === 0) {
        setError('No exercises available with current settings');
      } else {
        setCurrentList(workout);
        setError(null);
        hasSavedWorkoutRef.current = false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workout';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    if (phase === 'completed' && !hasSavedWorkoutRef.current) {
      saveWorkoutData();
    }
  }, [phase, saveWorkoutData]);

  const isTimerActive = phase === 'countdown' || phase === 'active';
  useInterval(
    () => {
      setSecondsLeft((prev) => prev - 1);
    },
    isTimerActive ? TIMER.ONE_SECOND : null,
  );

  useEffect(() => {
    if (phase === 'countdown') {
      if (secondsLeft > 0) playSmallBeep();
      else if (secondsLeft === 0) playFinalBeep();
    }
  }, [phase, secondsLeft, playSmallBeep, playFinalBeep]);

  useEffect(() => {
    if (secondsLeft !== 0) return;

    if (phase === 'countdown') {
      const duration = currentList[currentIndex]?.duration || 30;
      setSecondsLeft(duration);
      setTotalDuration(duration);
      setPhase('active');
    } else if (phase === 'active') {
      playEndSound();
      if (currentIndex < currentList.length - 1) {
        setCurrentIndex((i) => i + 1);
        setPhase('preview');
      } else {
        setPhase('completed');
      }
    }
  }, [secondsLeft, phase, currentIndex, currentList, playEndSound]);

  const startCountdown = () => {
    setSecondsLeft(3);
    setTotalDuration(3);
    setPhase('countdown');
  };

  const skipExercise = () => {
    if (currentIndex < currentList.length - 1) {
      setCurrentIndex((i) => i + 1);
      setPhase('preview');
    } else {
      setPhase('completed');
    }
  };

  const restartExercise = () => {
    const duration = currentList[currentIndex]?.duration || 30;
    setSecondsLeft(duration);
    setTotalDuration(duration);
    setPhase('active');
  };

  const currentExercise = useMemo(
    () => currentList[currentIndex]?.name ?? '',
    [currentList, currentIndex],
  );

  const progress = totalDuration > 0 ? (totalDuration - secondsLeft) / totalDuration : 0;

  return {
    phase,
    currentExercise,
    secondsLeft,
    totalDuration,
    progress,
    isLoading,
    error,
    startCountdown,
    skipExercise,
    restartExercise,
  };
}
