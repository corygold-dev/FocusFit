import {
  cancelAllDailyReminders,
  scheduleDailyReminder,
  scheduleMotivationalReminder,
} from '@/src/utils/notifications';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface NotificationContextType {
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

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
        await cancelAllDailyReminders();
        // Get user settings from AuthProvider when needed
        await scheduleDailyReminder(9, 0);
        await scheduleMotivationalReminder(15, 0);
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, [isLoading]);

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
