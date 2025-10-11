import { useBackendData } from '@/src/providers';
import { cleanupTimerResources } from '@/src/utils/cleanupTimerResources';
import { TIMER } from '@/src/utils/constants';
import { useCallback, useRef } from 'react';

interface BackgroundTimerOptions {
  isActive: boolean;
  secondsLeft: number;
  onScheduleNotification: (triggerDate: Date) => Promise<string | null>;
  onCleanup?: () => void;
}

export function useBackgroundTimer({
  isActive,
  secondsLeft,
  onScheduleNotification,
  onCleanup,
}: BackgroundTimerOptions) {
  const { settings } = useBackendData();
  const notificationIdRef = useRef<string | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const scheduleBackgroundNotification = useCallback(async () => {
    if (
      isActive &&
      secondsLeft > 0 &&
      endTimeRef.current === null &&
      settings?.timerEndNotifications
    ) {
      // Calculate end time for background timer
      endTimeRef.current = Date.now() + secondsLeft * TIMER.ONE_SECOND;

      try {
        const triggerDate = new Date(endTimeRef.current);
        notificationIdRef.current = await onScheduleNotification(triggerDate);
      } catch (error) {
        console.error('Failed to schedule background notification:', error);
        endTimeRef.current = null;
      }
    }
  }, [
    isActive,
    secondsLeft,
    settings?.timerEndNotifications,
    onScheduleNotification,
  ]);

  const cleanupBackgroundTimer = useCallback(async () => {
    await cleanupTimerResources({ current: null }, notificationIdRef);
    endTimeRef.current = null;
    onCleanup?.();
  }, [onCleanup]);

  const resetBackgroundTimer = useCallback(() => {
    endTimeRef.current = null;
  }, []);

  return {
    scheduleBackgroundNotification,
    cleanupBackgroundTimer,
    resetBackgroundTimer,
    notificationIdRef,
    endTimeRef,
  };
}
