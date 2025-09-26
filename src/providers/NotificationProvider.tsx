import {
  cancelAllDailyReminders,
  scheduleDailyReminder,
  scheduleMotivationalReminder,
} from '@/src/utils/notifications';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useBackendData } from './BackendDataProvider';

interface NotificationContextType {
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { settings: userSettings } = useBackendData();

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
  }, [userSettings]);

  useEffect(() => {
    const setupNotifications = async () => {
      if (isLoading || !userSettings) return;

      try {
        await cancelAllDailyReminders();

        if (userSettings.morningReminders) {
          await scheduleDailyReminder(9, 0); // 9 AM
        }

        if (userSettings.afternoonReminders) {
          await scheduleMotivationalReminder(); // 3 PM
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, [userSettings, isLoading]);

  return (
    <NotificationContext.Provider value={{ isLoading }}>{children}</NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
