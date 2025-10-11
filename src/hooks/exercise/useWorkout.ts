import { Exercise } from '@/src/lib/exercises';
import { useAuth, useBackendData, useSounds } from '@/src/providers';
import { TIMER, WORKOUT } from '@/src/utils/constants';
import { pickMobilityWorkout, pickStrengthWorkout, UserSettings } from '@/src/utils/exerciseUtils';
import { scheduleExerciseNotification } from '@/src/utils/notifications';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInterval } from '../timer';
import { useBackgroundTimer } from '../timer/useBackgroundTimer';

type Phase = 'preview' | 'countdown' | 'active' | 'completed';

interface UseWorkoutProps {
  settings: UserSettings;
  workoutType: 'strength' | 'mobility';
}

export function useWorkout({ settings, workoutType }: UseWorkoutProps) {
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

  const scheduleExerciseNotificationCallback = useCallback(async (triggerDate: Date) => {
    const currentExercise = currentList[currentIndex];
    if (currentExercise) {
      return await scheduleExerciseNotification(triggerDate, currentExercise.name);
    }
    return null;
  }, [currentList, currentIndex]);

  const {
    scheduleBackgroundNotification,
    cleanupBackgroundTimer,
  } = useBackgroundTimer({
    isActive: phase === 'active',
    secondsLeft,
    onScheduleNotification: scheduleExerciseNotificationCallback,
  });

  const handleStrengthProgression = useCallback(() => {
    const currentRound = currentIndex;
    if (currentRound < WORKOUT.STRENGTH.ROUNDS - 1) {
      const nextIndex = currentRound + 1;
      setCurrentIndex(nextIndex);
      setPhase('preview');
    } else {
      setPhase('completed');
    }
  }, [currentIndex]);

  const saveWorkoutData = useCallback(async () => {
    if (!user?.uid || currentList.length === 0 || hasSavedWorkoutRef.current) return;

    try {
      hasSavedWorkoutRef.current = true;

      const sessionId = `workout_${Date.now()}`;
      const exercises = currentList.map((exercise) => exercise.name);

      let duration: number;
      if (workoutType === 'strength') {
        duration = WORKOUT.STRENGTH.TOTAL_DURATION;
      } else {
        duration = currentList.reduce(
          (total, exercise) =>
            total + (exercise.duration || WORKOUT.MOBILITY.DURATION_PER_EXERCISE),
          0,
        );
      }

      await saveWorkoutSession({
        sessionId,
        exercises,
        duration,
        completedAt: new Date(),
      });

      const currentProgress = await getUserProgress();
      if (currentProgress) {
        await saveUserProgress({
          lastWorkoutDate: new Date(),
        });
      }
    } catch (error) {
      console.error('Error saving workout session:', error);
      hasSavedWorkoutRef.current = false;
    } finally {
      await cleanupBackgroundTimer();
    }
  }, [user?.uid, currentList, workoutType, saveWorkoutSession, getUserProgress, saveUserProgress]);

  useEffect(() => {
    try {
      setIsLoading(true);
      let workout: Exercise[];

      if (workoutType === 'strength') {
        workout = pickStrengthWorkout(settings);
      } else {
        workout = pickMobilityWorkout(settings);
      }
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
  }, [settings, workoutType]);

  useEffect(() => {
    if (phase === 'completed' && !hasSavedWorkoutRef.current) {
      saveWorkoutData();
    }
  }, [phase, saveWorkoutData]);

  const isTimerActive = phase === 'countdown' || phase === 'active';

  useEffect(() => {
    scheduleBackgroundNotification();
  }, [scheduleBackgroundNotification]);

  useEffect(() => {
    if (phase !== 'active') {
      cleanupBackgroundTimer();
    }
  }, [phase, cleanupBackgroundTimer]);

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
      let duration: number;
      if (workoutType === 'strength') {
        duration = WORKOUT.STRENGTH.DURATION_PER_ROUND;
      } else {
        duration = currentList[currentIndex]?.duration || WORKOUT.MOBILITY.DURATION_PER_EXERCISE;
      }
      setSecondsLeft(duration);
      setTotalDuration(duration);
      setPhase('active');
    } else if (phase === 'active') {
      playEndSound();

      if (workoutType === 'strength') {
        handleStrengthProgression();
      } else {
        if (currentIndex < currentList.length - 1) {
          setCurrentIndex((i) => i + 1);
          setPhase('preview');
        } else {
          setPhase('completed');
        }
      }
    }
  }, [
    secondsLeft,
    phase,
    currentIndex,
    currentList,
    playEndSound,
    workoutType,
    handleStrengthProgression,
  ]);

  const startCountdown = () => {
    setSecondsLeft(3);
    setTotalDuration(3);
    setPhase('countdown');
  };

  const skipExercise = () => {
    if (workoutType === 'strength') {
      handleStrengthProgression();
    } else {
      if (currentIndex < currentList.length - 1) {
        setCurrentIndex((i) => i + 1);
        setPhase('preview');
      } else {
        setPhase('completed');
      }
    }
  };

  const restartExercise = () => {
    let duration: number;
    if (workoutType === 'strength') {
      duration = WORKOUT.STRENGTH.DURATION_PER_ROUND;
    } else {
      duration = currentList[currentIndex]?.duration || WORKOUT.MOBILITY.DURATION_PER_EXERCISE;
    }
    setSecondsLeft(duration);
    setTotalDuration(duration);
    setPhase('active');
  };

  const currentExercise = useMemo(() => {
    if (workoutType === 'strength' && currentList.length >= 2) {
      const exerciseIndex = currentIndex % 2;
      return currentList[exerciseIndex]?.name ?? '';
    }
    return currentList[currentIndex]?.name ?? '';
  }, [currentList, currentIndex, workoutType]);

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
