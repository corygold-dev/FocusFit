import { useTheme } from '@/src/providers';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { buttonStyles } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  title,
  variant = 'primary',
  disabled = false,
  style,
  ...rest
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = buttonStyles(theme, variant, disabled);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      accessibilityRole="button"
      {...rest}
    >
      <Text
        style={[
          styles.text,
          variant === 'primary' ? styles.primaryText : styles.secondaryText,
          disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
