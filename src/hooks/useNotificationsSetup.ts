import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useNotificationsSetup() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const setup = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.warn('Notification permissions not granted');
          return;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'FocusFit Notifications',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'finish_sound',
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6B35',
          });

          await Notifications.setNotificationChannelAsync('daily_reminders', {
            name: 'Daily Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'short_beep',
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF6B35',
          });
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setup();
  }, []);
}
