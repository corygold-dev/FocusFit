import {
  cancelAllDailyReminders,
  checkNotificationPermissions,
  requestNotificationPermissions,
  scheduleDailyReminder,
  scheduleMotivationalReminder,
} from '@/src/utils/notifications';
import * as Notifications from 'expo-notifications';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,

    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationContextType {
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { getUserProgress } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading notification settings:', error);
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      if (isLoading) return;

      try {
        // Check and request notification permissions
        let hasPermission = await checkNotificationPermissions();
        if (!hasPermission) {
          console.log('📱 Requesting notification permissions...');
          hasPermission = await requestNotificationPermissions();
        }

        if (!hasPermission) {
          console.log('📱 Notification permissions not granted');
          return;
        }

        await cancelAllDailyReminders();

        // Get user's current streak
        const progress = await getUserProgress();
        const focusStreak = progress?.focusStreak || 0;

        // Schedule notifications with streak info
        await scheduleDailyReminder(9, 0);
        await scheduleMotivationalReminder(15, 0, focusStreak);
        console.log('📱 Notifications scheduled successfully');
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, [isLoading, getUserProgress]);

  return (
    <NotificationContext.Provider value={{ isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationProvider'
    );
  }
  return context;
};
