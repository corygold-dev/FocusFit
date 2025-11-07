import React from 'react';
import { AuthProvider } from './AuthProvider';
import { NotificationProvider } from './NotificationProvider';
import { PurchaseProvider } from './PurchaseProvider';
import { SoundProvider } from './SoundProvider';
import { ThemeProvider } from './ThemeProvider';
import { TimerProvider } from './TimerProvider';
import { WorkoutProvider } from './WorkoutProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <PurchaseProvider>
        <ThemeProvider>
          <SoundProvider>
            <NotificationProvider>
              <TimerProvider>
                <WorkoutProvider>{children}</WorkoutProvider>
              </TimerProvider>
            </NotificationProvider>
          </SoundProvider>
        </ThemeProvider>
      </PurchaseProvider>
    </AuthProvider>
  );
};
