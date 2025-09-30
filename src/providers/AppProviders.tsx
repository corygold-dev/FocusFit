import React from 'react';
import { AuthProvider } from './AuthProvider';
import { NotificationProvider } from './NotificationProvider';
import { SoundProvider } from './SoundProvider';
import { ThemeProvider } from './ThemeProvider';
import { TimerProvider } from './TimerProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * AppProviders - Single provider architecture
 *
 * Architecture:
 * 1. AuthProvider - Manages authentication, data persistence, and subscriptions
 * 2. Other providers - Independent services (theme, sound, notifications, timer)
 *
 * This pattern ensures:
 * - No circular dependencies
 * - Single source of truth for auth/data/subscription
 * - Clean separation of concerns
 * - Easy testing and maintenance
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const appProvidersId = Math.random().toString(36).substr(2, 9);
  console.log(`🏗️ AppProviders [${appProvidersId}]: Rendering providers...`);
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
