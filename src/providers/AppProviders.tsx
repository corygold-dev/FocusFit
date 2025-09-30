import React from 'react';
import { AuthProvider } from './AuthProvider';
import { NotificationProvider } from './NotificationProvider';
import { SoundProvider } from './SoundProvider';
import { ThemeProvider } from './ThemeProvider';
import { TimerProvider } from './TimerProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SoundProvider>
          <NotificationProvider>
            <TimerProvider>{children}</TimerProvider>
          </NotificationProvider>
        </SoundProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
