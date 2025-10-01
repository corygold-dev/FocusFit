import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxWidth: 450,
      backgroundColor: theme.colors.modalBackground,
      borderRadius: 12,
      height: '80%',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 10,
      color: theme.colors.text,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.modalBackground,
    },
    logoutSection: {
      marginTop: 24,
      marginBottom: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 16,
    },
    logoutButton: {
      backgroundColor: theme.colors.error + '15',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.colors.error,
      alignItems: 'center',
    },
    logoutText: {
      color: theme.colors.error,
      fontWeight: '600',
      fontSize: 16,
    },
  });
