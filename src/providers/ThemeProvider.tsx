import { getTheme, Theme } from '@/styles/theme';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import _ from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { THEME_MODE_STORAGE_KEY } from '../utils/constants';

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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Inter-Regular': Inter_400Regular,
          'Inter-Medium': Inter_500Medium,
          'Inter-SemiBold': Inter_600SemiBold,
          'Inter-Bold': Inter_700Bold,
          'Poppins-Regular': Poppins_400Regular,
          'Poppins-SemiBold': Poppins_600SemiBold,
          'Poppins-Bold': Poppins_700Bold,
        });
      } catch (error) {
        console.error('Failed to load fonts', error);
      }
    }

    loadFonts();
  }, []);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY);
        if (!_.isNil(savedTheme)) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };

    loadThemePreference();
  }, []);

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = getTheme(isDark);

  const updateThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    _.attempt(
      async () => {
        await AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
      },
      (error: unknown) => {
        if (error instanceof Error) {
          console.error('Failed to save theme preference', error.message);
        } else {
          console.error('Failed to save theme preference', String(error));
        }
      }
    );
  };

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, themeMode, setThemeMode: updateThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
