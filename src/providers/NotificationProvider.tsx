import {
  cancelAllDailyReminders,
  scheduleDailyReminder,
  scheduleMotivationalReminder,
} from '@/src/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface NotificationSettings {
  dailyReminderEnabled: boolean;
  dailyReminderTime: { hour: number; minute: number };
  motivationalReminderEnabled: boolean;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  isLoading: boolean;
}

const defaultSettings: NotificationSettings = {
  dailyReminderEnabled: true,
  dailyReminderTime: { hour: 9, minute: 0 },
  motivationalReminderEnabled: true,
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

const NOTIFICATION_SETTINGS_KEY = 'notificationSettings';

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (saved) {
          const parsedSettings = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      if (isLoading) return;

      try {
        // Cancel existing reminders
        await cancelAllDailyReminders();

        // Schedule new reminders based on settings
        if (settings.dailyReminderEnabled) {
          await scheduleDailyReminder(
            settings.dailyReminderTime.hour,
            settings.dailyReminderTime.minute,
          );
        }

        if (settings.motivationalReminderEnabled) {
          await scheduleMotivationalReminder();
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, [settings, isLoading]);

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
