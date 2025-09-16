import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Settings = {
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
};

type UserSettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
  difficulty: 'medium',
  equipment: [],
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('userSettings');
      if (saved) setSettings(JSON.parse(saved));
    })();
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    AsyncStorage.setItem('userSettings', JSON.stringify(updated));
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) throw new Error('useUserSettings must be used within UserSettingsProvider');
  return context;
};
