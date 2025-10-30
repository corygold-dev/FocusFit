import * as Notifications from 'expo-notifications';
import {
  cancelAllDailyReminders,
  cancelNotification,
  checkNotificationPermissions,
  requestNotificationPermissions,
  scheduleDailyReminder,
  scheduleExerciseNotification,
  scheduleMotivationalReminder,
  scheduleTimerNotification,
} from '../notifications';

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
}));

describe('notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('scheduleTimerNotification', () => {
    it('should schedule timer notification successfully', async () => {
      const mockId = 'timer-notification-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const triggerDate = new Date('2025-01-01T10:00:00Z');
      const result = await scheduleTimerNotification(triggerDate);

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Focus Timer Finished',
          body: 'Time to Move!',
          sound: 'finish-sound.wav',
        },
        trigger: {
          type: 'date',
          date: triggerDate,
        },
      });
    });

    it('should return null and log error on failure', async () => {
      const mockError = new Error('Schedule failed');
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        mockError
      );

      const result = await scheduleTimerNotification(new Date());

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to schedule notification:',
        mockError
      );
    });
  });

  describe('scheduleExerciseNotification', () => {
    it('should schedule exercise notification with exercise name', async () => {
      const mockId = 'exercise-notification-456';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const triggerDate = new Date('2025-01-01T10:30:00Z');
      const result = await scheduleExerciseNotification(
        triggerDate,
        'Push-ups'
      );

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Exercise Complete!',
          body: 'Push-ups finished - Next exercise ready',
          sound: 'finish-sound.wav',
        },
        trigger: {
          type: 'date',
          date: triggerDate,
        },
      });
    });

    it('should handle different exercise names', async () => {
      const mockId = 'exercise-notification-789';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      await scheduleExerciseNotification(new Date(), 'Squats');

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            body: 'Squats finished - Next exercise ready',
          }),
        })
      );
    });

    it('should return null and log error on failure', async () => {
      const mockError = new Error('Exercise schedule failed');
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        mockError
      );

      const result = await scheduleExerciseNotification(new Date(), 'Planks');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to schedule exercise notification:',
        mockError
      );
    });
  });

  describe('cancelNotification', () => {
    it('should cancel notification with valid id', async () => {
      const mockId = 'notification-to-cancel';
      (
        Notifications.cancelScheduledNotificationAsync as jest.Mock
      ).mockResolvedValue(undefined);

      await cancelNotification(mockId);

      expect(
        Notifications.cancelScheduledNotificationAsync
      ).toHaveBeenCalledWith(mockId);
    });

    it('should not cancel when id is null', async () => {
      await cancelNotification(null);

      expect(
        Notifications.cancelScheduledNotificationAsync
      ).not.toHaveBeenCalled();
    });

    it('should handle empty string id', async () => {
      await cancelNotification('');

      expect(
        Notifications.cancelScheduledNotificationAsync
      ).not.toHaveBeenCalled();
    });
  });

  describe('scheduleDailyReminder', () => {
    it('should schedule daily reminder with default time', async () => {
      const mockId = 'daily-reminder-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const result = await scheduleDailyReminder();

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Ready to Lock In? 🔥',
          body: 'Your daily focus session is waiting. Time to crush your goals!',
          sound: 'short-beep.wav',
          data: { type: 'daily_reminder' },
        },
        trigger: {
          type: 'daily',
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    });

    it('should schedule daily reminder with custom time', async () => {
      const mockId = 'daily-reminder-456';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const result = await scheduleDailyReminder(14, 30);

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({
            hour: 14,
            minute: 30,
          }),
        })
      );
    });

    it('should return null and log error on failure', async () => {
      const mockError = new Error('Daily reminder failed');
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        mockError
      );

      const result = await scheduleDailyReminder();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to schedule daily reminder:',
        mockError
      );
    });
  });

  describe('scheduleMotivationalReminder', () => {
    it('should schedule motivational reminder with streak message when streak > 1', async () => {
      const mockId = 'motivational-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const result = await scheduleMotivationalReminder(15, 0, 5);

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: "Don't Break the Streak! 💪",
          body: "You're on a 5 day streak! Keep the momentum going with another focus session.",
          sound: 'short-ping.mp3',
          data: { type: 'motivational', streak: 5 },
        },
        trigger: {
          type: 'daily',
          hour: 15,
          minute: 0,
          repeats: true,
        },
      });
    });

    it('should schedule motivational reminder with beginner message when streak is 0', async () => {
      const mockId = 'motivational-456';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const result = await scheduleMotivationalReminder(15, 0, 0);

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Time to Focus! 🎯',
          body: 'Start building your streak today. Every great journey begins with a single step.',
          sound: 'short-ping.mp3',
          data: { type: 'motivational', streak: 0 },
        },
        trigger: {
          type: 'daily',
          hour: 15,
          minute: 0,
          repeats: true,
        },
      });
    });

    it('should schedule motivational reminder with beginner message when streak is 1', async () => {
      const mockId = 'motivational-789';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const result = await scheduleMotivationalReminder(15, 0, 1);

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Time to Focus! 🎯',
          body: 'Start building your streak today. Every great journey begins with a single step.',
          sound: 'short-ping.mp3',
          data: { type: 'motivational', streak: 1 },
        },
        trigger: {
          type: 'daily',
          hour: 15,
          minute: 0,
          repeats: true,
        },
      });
    });

    it('should schedule motivational reminder with custom time', async () => {
      const mockId = 'motivational-custom';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockId
      );

      const result = await scheduleMotivationalReminder(18, 45, 3);

      expect(result).toBe(mockId);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({
            hour: 18,
            minute: 45,
          }),
        })
      );
    });

    it('should return null and log error on failure', async () => {
      const mockError = new Error('Motivational reminder failed');
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        mockError
      );

      const result = await scheduleMotivationalReminder(15, 0, 2);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to schedule motivational reminder:',
        mockError
      );
    });
  });

  describe('cancelAllDailyReminders', () => {
    it('should cancel all daily and motivational reminders', async () => {
      const mockNotifications = [
        {
          identifier: 'notification-1',
          content: { data: { type: 'daily_reminder' } },
        },
        {
          identifier: 'notification-2',
          content: { data: { type: 'motivational' } },
        },
        {
          identifier: 'notification-3',
          content: { data: { type: 'other' } },
        },
      ];

      (
        Notifications.getAllScheduledNotificationsAsync as jest.Mock
      ).mockResolvedValue(mockNotifications);
      (
        Notifications.cancelScheduledNotificationAsync as jest.Mock
      ).mockResolvedValue(undefined);

      await cancelAllDailyReminders();

      expect(
        Notifications.cancelScheduledNotificationAsync
      ).toHaveBeenCalledTimes(2);
      expect(
        Notifications.cancelScheduledNotificationAsync
      ).toHaveBeenCalledWith('notification-1');
      expect(
        Notifications.cancelScheduledNotificationAsync
      ).toHaveBeenCalledWith('notification-2');
      expect(
        Notifications.cancelScheduledNotificationAsync
      ).not.toHaveBeenCalledWith('notification-3');
    });

    it('should handle empty notification list', async () => {
      (
        Notifications.getAllScheduledNotificationsAsync as jest.Mock
      ).mockResolvedValue([]);

      await cancelAllDailyReminders();

      expect(
        Notifications.cancelScheduledNotificationAsync
      ).not.toHaveBeenCalled();
    });

    it('should log error on failure', async () => {
      const mockError = new Error('Failed to get notifications');
      (
        Notifications.getAllScheduledNotificationsAsync as jest.Mock
      ).mockRejectedValue(mockError);

      await cancelAllDailyReminders();

      expect(console.error).toHaveBeenCalledWith(
        'Failed to cancel daily reminders:',
        mockError
      );
    });
  });

  describe('checkNotificationPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await checkNotificationPermissions();

      expect(result).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when permissions are denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await checkNotificationPermissions();

      expect(result).toBe(false);
    });

    it('should return false when permissions are undetermined', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });

      const result = await checkNotificationPermissions();

      expect(result).toBe(false);
    });

    it('should return false and log error on failure', async () => {
      const mockError = new Error('Permission check failed');
      (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
        mockError
      );

      const result = await checkNotificationPermissions();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to check notification permissions:',
        mockError
      );
    });
  });

  describe('requestNotificationPermissions', () => {
    it('should return true when permissions are granted', async () => {
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await requestNotificationPermissions();

      expect(result).toBe(true);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false when permissions are denied', async () => {
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await requestNotificationPermissions();

      expect(result).toBe(false);
    });

    it('should return false and log error on failure', async () => {
      const mockError = new Error('Permission request failed');
      (Notifications.requestPermissionsAsync as jest.Mock).mockRejectedValue(
        mockError
      );

      const result = await requestNotificationPermissions();

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to request notification permissions:',
        mockError
      );
    });
  });
});
