import * as Notifications from 'expo-notifications';

export async function scheduleTimerNotification(triggerDate: Date) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Focus Timer Finished',
        body: 'Time to Move!',
        sound: 'finish-sound.wav', // custom sound
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

export async function cancelNotification(id: string | null) {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}
