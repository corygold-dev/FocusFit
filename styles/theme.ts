export const colors = {
  primary: '#2575FC',
  primaryLight: '#4B9DFE',
  success: '#4CD964',
  error: '#FF6B6B',

  light: {
    background: '#FFFFFF',
    surface: '#F7F9FC',
    surfaceVariant: '#F0F4F8',
    text: '#1A202C',
    textSecondary: '#4A5568',
    border: '#E1E8F0',
    switchThumb: '#FFFFFF',
    buttonDisabled: '#CBD5E0',
    modalBackground: '#FFFFFF',
    card: '#FFFFFF',
  },

  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#CBD5E0',
    border: '#2D3748',
    switchThumb: '#E1E8F0',
    buttonDisabled: '#4A5568',
    modalBackground: '#2C2C2C',
    card: '#1E1E1E',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const getTheme = (isDark: boolean) => ({
  colors: {
    ...colors,
    ...(isDark ? colors.dark : colors.light),
  },
  spacing,
});

export type Theme = ReturnType<typeof getTheme>;
