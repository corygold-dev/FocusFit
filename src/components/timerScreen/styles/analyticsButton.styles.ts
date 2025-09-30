import { StyleSheet } from 'react-native';

export const analyticsButtonStyles = () =>
  StyleSheet.create({
    header: {
      width: '100%',
      position: 'absolute',
      top: 10,
      left: 20,
      alignItems: 'flex-start',
      zIndex: 1000,
    },
    analyticsButton: {
      padding: 16,
      borderRadius: 8,
      minWidth: 50,
      minHeight: 50,
    },
  });
