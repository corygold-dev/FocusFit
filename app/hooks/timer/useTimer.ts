import { useInterval } from '@/app/hooks/timer/useInterval';
import { useSounds } from '@/app/providers/SoundProvider';
import { cleanupTimerResources } from '@/utils/cleanupTimerResources';
import { TIMER } from '@/utils/constants';
import { scheduleTimerNotification } from '@/utils/notifications';
import { useEffect, useMemo, useRef, useState } from 'react';

interface TimerOptions {
  onComplete?: () => void;
  initialDuration?: number;
}

export function useTimer({
  onComplete,
  initialDuration = TIMER.DEFAULT_MINUTES * 60,
}: TimerOptions = {}) {
  const [duration, setDuration] = useState(initialDuration);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationIdRef = useRef<string | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const { playEndSound } = useSounds();

  const progress = useMemo(() => 1 - secondsLeft / duration, [secondsLeft, duration]);

  const startTimer = async (newDuration?: number) => {
    const time = newDuration ?? secondsLeft;
    endTimeRef.current = Date.now() + time * TIMER.ONE_SECOND;

    setIsRunning(true);

    if (endTimeRef.current) {
      const triggerDate = new Date(endTimeRef.current);
      try {
        notificationIdRef.current = await scheduleTimerNotification(triggerDate);
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }
  };

  const pauseTimer = async () => {
    setIsRunning(false);

    await cleanupTimerResources(intervalRef, notificationIdRef);

    if (endTimeRef.current) {
      const remaining = Math.max(
        Math.ceil((endTimeRef.current - Date.now()) / TIMER.ONE_SECOND),
        0,
      );
      setSecondsLeft(remaining);
      endTimeRef.current = null;
    }
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setSecondsLeft(duration);
    endTimeRef.current = null;

    await cleanupTimerResources(intervalRef, notificationIdRef);
  };

  const toggleTimer = () => {
    if (isRunning) pauseTimer();
    else startTimer();
  };

  const setCustomDuration = (minutes: number) => {
    if (isRunning) return;

    const newSeconds = minutes * 60;
    setDuration(newSeconds);
    setSecondsLeft(newSeconds);
    endTimeRef.current = null;
  };

  useInterval(
    () => {
      if (!endTimeRef.current) return;

      const remaining = Math.max(
        Math.ceil((endTimeRef.current - Date.now()) / TIMER.ONE_SECOND),
        0,
      );
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setIsRunning(false);
        playEndSound();
        onComplete?.();
      }
    },
    isRunning ? TIMER.ONE_SECOND : null,
  );

  useEffect(() => {
    return () => {
      cleanupTimerResources(intervalRef, notificationIdRef);
    };
  }, []);

  return {
    duration,
    secondsLeft,
    isRunning,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleTimer,
    setCustomDuration,
  };
}
