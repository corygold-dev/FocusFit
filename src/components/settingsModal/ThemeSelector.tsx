import { useTheme } from '@/src/providers';
import { THEME_MODES, ThemeMode } from '@/src/utils/constants';
import {
  ChevronDown,
  ChevronUp,
  Moon,
  Smartphone,
  Sun,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { themeSelectorStyles } from './styles';

type ThemeSelectorProps = {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
};

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const { theme } = useTheme();
  const styles = themeSelectorStyles(theme);

  const [showDropdown, setShowDropdown] = useState(false);

  const getThemeIcon = useCallback(
    (mode: ThemeMode) => {
      switch (mode) {
        case 'light':
          return (
            <Sun
              size={18}
              color={
                mode === currentTheme ? theme.colors.primary : theme.colors.text
              }
            />
          );
        case 'dark':
          return (
            <Moon
              size={18}
              color={
                mode === currentTheme ? theme.colors.primary : theme.colors.text
              }
            />
          );
        case 'system':
          return (
            <Smartphone
              size={18}
              color={
                mode === currentTheme ? theme.colors.primary : theme.colors.text
              }
            />
          );
        default:
          return null;
      }
    },
    [currentTheme, theme.colors.primary, theme.colors.text]
  );

  const getThemeLabel = useCallback((mode: ThemeMode) => {
    return mode === 'system'
      ? 'Match System'
      : mode === 'dark'
        ? 'Dark'
        : 'Light';
  }, []);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <View style={styles.themeOptionContainer}>
          {getThemeIcon(currentTheme)}
          <Text style={styles.dropdownText}>{getThemeLabel(currentTheme)}</Text>
        </View>
        {showDropdown ? (
          <ChevronUp size={20} color={theme.colors.text} />
        ) : (
          <ChevronDown size={20} color={theme.colors.text} />
        )}
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {THEME_MODES.map(modeOption => (
            <TouchableOpacity
              key={modeOption}
              style={[
                styles.dropdownOption,
                modeOption === currentTheme && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                onThemeChange(modeOption);
                setShowDropdown(false);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: modeOption === currentTheme }}
              accessibilityLabel={`${getThemeLabel(modeOption)} theme${modeOption === currentTheme ? ', selected' : ''}`}
            >
              <View style={styles.themeOptionContainer}>
                {getThemeIcon(modeOption)}
                <Text
                  style={[
                    styles.dropdownOptionText,
                    modeOption === currentTheme &&
                      styles.dropdownOptionTextSelected,
                  ]}
                >
                  {getThemeLabel(modeOption)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
