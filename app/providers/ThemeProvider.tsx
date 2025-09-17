import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getTheme, Theme } from '@/styles/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: getTheme(false),
  isDark: false,
  themeMode: 'system',
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme_mode');
        if (!_.isNil(savedTheme)) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };

    loadThemePreference();
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  const theme = getTheme(isDark);

  const updateThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    _.attempt(
      async () => {
        await AsyncStorage.setItem('@theme_mode', mode);
      },
      (error: unknown) => {
        if (error instanceof Error) {
          console.error('Failed to save theme preference', error.message);
        } else {
          console.error('Failed to save theme preference', String(error));
        }
      },
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, themeMode, setThemeMode: updateThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
