import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const modalButtonStyles = (
  theme: Theme,
  position: 'left' | 'right' = 'right'
) =>
  StyleSheet.create({
    header: {
      position: 'absolute',
      top: 0,
      [position]: 20,
      zIndex: 10,
    },
    button: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'transparent',
    },
  });
