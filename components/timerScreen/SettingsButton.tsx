import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { settingsButtonStyles } from './styles';
import { useTheme } from '@/app/providers';

interface SettingsButtonProps {
  onPress: () => void;
}

export default function SettingsButton({ onPress }: SettingsButtonProps) {
  const { theme } = useTheme();
  const styles = settingsButtonStyles();

  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.cogButton}
        accessibilityLabel="Open settings"
        accessibilityRole="button"
      >
        <Settings size={32} color={theme.colors.primary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
