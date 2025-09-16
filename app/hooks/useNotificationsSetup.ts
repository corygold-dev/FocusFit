import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
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
        if (Platform.OS === 'ios') {
          await Notifications.requestPermissionsAsync();
        } else if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
          });
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setup();
  }, []);
}
