import * as Notifications from 'expo-notifications';
import endSoundFile from '../../assets/audio/finish-sound.wav';

export async function scheduleTimerNotification(seconds: number) {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up ⏱️",
        body: 'Your focus session has ended.',
        sound: endSoundFile,
      },
      trigger: {
        type: 'timeInterval',
        seconds,
        repeats: false,
      } as Notifications.TimeIntervalTriggerInput,
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
