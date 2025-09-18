import { cancelNotification } from './notifications';

export const cleanupTimerResources = async (
  intervalRef: { current: number | null },
  notificationIdRef: { current: string | null },
): Promise<void> => {
  if (intervalRef.current !== null) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  if (notificationIdRef.current !== null) {
    try {
      await cancelNotification(notificationIdRef.current);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
    notificationIdRef.current = null;
  }
};
