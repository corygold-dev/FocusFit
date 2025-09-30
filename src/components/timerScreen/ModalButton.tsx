import { useTheme } from '@/src/providers';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { modalButtonStyles } from './styles';

interface ModalButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  accessibilityLabel: string;
  position?: 'left' | 'right';
}

export default function ModalButton({
  onPress,
  icon,
  accessibilityLabel,
  position = 'right',
}: ModalButtonProps) {
  const { theme } = useTheme();
  const styles = modalButtonStyles(theme, position);

  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        {icon}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
