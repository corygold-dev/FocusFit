import * as Notifications from 'expo-notifications';

export async function scheduleTimerNotification(triggerDate: Date) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Focus Timer Finished',
        body: 'Time to Move!',
        sound: 'finish-sound.wav',
      },
      trigger: {
        type: 'date',
        date: triggerDate,
      } as Notifications.DateTriggerInput,
    });
    return id;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
}

export async function scheduleExerciseNotification(
  triggerDate: Date,
  exerciseName: string
) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Exercise Complete!',
        body: `${exerciseName} finished - Next exercise ready`,
        sound: 'finish-sound.wav',
      },
      trigger: {
        type: 'date',
        date: triggerDate,
      } as Notifications.DateTriggerInput,
    });
    return id;
  } catch (error) {
    console.error('Failed to schedule exercise notification:', error);
    return null;
  }
}

export async function cancelNotification(id: string | null) {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}

export async function scheduleDailyReminder(
  hour: number = 9,
  minute: number = 0
) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Ready to Lock In? 🔥',
        body: 'Your daily focus session is waiting. Time to crush your goals!',
        sound: 'short-beep.wav',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: 'daily',
        hour,
        minute,
        repeats: true,
      } as Notifications.DailyTriggerInput,
    });
    return id;
  } catch (error) {
    console.error('Failed to schedule daily reminder:', error);
    return null;
  }
}

export async function scheduleMotivationalReminder(
  hour: number = 15,
  minute: number = 0,
  currentStreak: number = 0
) {
  try {
    // Different messages based on whether user has a streak
    const hasStreak = currentStreak > 1;
    const content = hasStreak
      ? {
          title: "Don't Break the Streak! 💪",
          body: `You're on a ${currentStreak} day streak! Keep the momentum going with another focus session.`,
        }
      : {
          title: 'Time to Focus! 🎯',
          body: 'Start building your streak today. Every great journey begins with a single step.',
        };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        ...content,
        sound: 'short-ping.mp3',
        data: { type: 'motivational', streak: currentStreak },
      },
      trigger: {
        type: 'daily',
        hour,
        minute,
        repeats: true,
      } as Notifications.DailyTriggerInput,
    });
    return id;
  } catch (error) {
    console.error('Failed to schedule motivational reminder:', error);
    return null;
  }
}

export async function cancelAllDailyReminders() {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const dailyReminders = scheduledNotifications.filter(
      notification =>
        notification.content.data?.type === 'daily_reminder' ||
        notification.content.data?.type === 'motivational'
    );

    for (const notification of dailyReminders) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  } catch (error) {
    console.error('Failed to cancel daily reminders:', error);
  }
}

export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to check notification permissions:', error);
    return false;
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
}
