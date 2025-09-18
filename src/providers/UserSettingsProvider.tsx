import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { USER_SETTINGS_STORAGE_KEY } from '../utils/constants';

type Settings = {
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  excludedExercises: string[];
};

type UserSettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  isLoading: boolean;
};

const defaultSettings: Settings = {
  difficulty: 'medium',
  equipment: [],
  excludedExercises: [],
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(USER_SETTINGS_STORAGE_KEY);
        if (saved) {
          setSettings(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = _.debounce(async (settingsToSave: Settings) => {
    try {
      await AsyncStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, 300);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) throw new Error('useUserSettings must be used within UserSettingsProvider');
  return context;
};
