import { useEffect, useMemo, useState } from 'react';
import { useInterval } from '../timer';
import { Exercise } from '@/src/lib/exercises';
import { pickWorkout } from '@/src/utils/exerciseUtils';
import { TIMER } from '@/src/utils/constants';
import { useSounds } from '@/src/providers';

type Phase = 'preview' | 'countdown' | 'active' | 'completed';
type UserSettings = {
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  excludedExercises: string[];
};

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

  const { playSmallBeep, playFinalBeep, playEndSound } = useSounds();

  useEffect(() => {
    try {
      setIsLoading(true);
      const workout = pickWorkout(settings);
      if (workout.length === 0) {
        setError('No exercises available with current settings');
      } else {
        setCurrentList(workout);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load workout');
      console.error('Workout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

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
  };
}
