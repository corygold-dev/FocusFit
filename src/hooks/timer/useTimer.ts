import { useSounds } from '@/src/providers';
import { cleanupTimerResources } from '@/src/utils/cleanupTimerResources';
import { TIMER } from '@/src/utils/constants';
import { scheduleTimerNotification } from '@/src/utils/notifications';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useBackgroundTimer } from './useBackgroundTimer';
import { useInterval } from './useInterval';

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

  const { playEndSound } = useSounds();

  const progress = useMemo(
    () => 1 - secondsLeft / duration,
    [secondsLeft, duration]
  );

  const {
    scheduleBackgroundNotification,
    cleanupBackgroundTimer,
    resetBackgroundTimer,
    notificationIdRef,
    endTimeRef,
  } = useBackgroundTimer({
    isActive: isRunning,
    secondsLeft,
    onScheduleNotification: scheduleTimerNotification,
  });

  const startTimer = async (newDuration?: number) => {
    const time = newDuration ?? secondsLeft;
    setSecondsLeft(time);
    setIsRunning(true);
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      scheduleBackgroundNotification();
    }
  }, [isRunning, scheduleBackgroundNotification, secondsLeft]);

  const pauseTimer = async () => {
    setIsRunning(false);

    await cleanupTimerResources(intervalRef, notificationIdRef);
    await cleanupBackgroundTimer();

    if (endTimeRef.current) {
      const remaining = Math.max(
        Math.ceil((endTimeRef.current - Date.now()) / TIMER.ONE_SECOND),
        0
      );
      setSecondsLeft(remaining);
      resetBackgroundTimer();
    }
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setSecondsLeft(duration);
    resetBackgroundTimer();

    await cleanupTimerResources(intervalRef, notificationIdRef);
    await cleanupBackgroundTimer();
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
      if (!isRunning) return;

      if (endTimeRef.current) {
        const remaining = Math.max(
          Math.ceil((endTimeRef.current - Date.now()) / TIMER.ONE_SECOND),
          0
        );

        if (remaining <= 0) {
          setIsRunning(false);
          cleanupTimerResources(intervalRef, notificationIdRef);
          playEndSound();
          onComplete?.();
          setSecondsLeft(0);
        } else {
          setSecondsLeft(remaining);
        }
      } else {
        setSecondsLeft(prev => {
          const newSeconds = prev - 1;

          if (newSeconds <= 0) {
            setIsRunning(false);
            cleanupTimerResources(intervalRef, notificationIdRef);
            playEndSound();
            onComplete?.();
            return 0;
          }

          return newSeconds;
        });
      }
    },
    isRunning ? TIMER.ONE_SECOND : null
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active' && isRunning && endTimeRef.current) {
          const remaining = Math.max(
            Math.ceil((endTimeRef.current - Date.now()) / TIMER.ONE_SECOND),
            0
          );
          setSecondsLeft(remaining);

          if (remaining <= 0) {
            setIsRunning(false);
            cleanupTimerResources(intervalRef, notificationIdRef);
            playEndSound();
            onComplete?.();
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [isRunning, endTimeRef, onComplete, playEndSound, notificationIdRef]);

  useEffect(() => {
    return () => {
      cleanupTimerResources(intervalRef, notificationIdRef);
      cleanupBackgroundTimer();
    };
  }, [cleanupBackgroundTimer, notificationIdRef]);

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
