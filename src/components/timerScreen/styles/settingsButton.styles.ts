import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    header: {
      width: '100%',
      position: 'absolute',
      top: 10,
      right: 20,
      alignItems: 'flex-end',
    },
    cogButton: {
      padding: 8,
    },
  });
