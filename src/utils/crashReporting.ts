import { Platform } from 'react-native';

interface CrashInfo {
  error: Error;
  timestamp: string;
  platform: string;
  userAgent?: string;
  stack?: string;
}

interface ReactNativeErrorUtils {
  getGlobalHandler: () => ((error: Error, isFatal: boolean) => void) | undefined;
  setGlobalHandler: (handler: (error: Error, isFatal: boolean) => void) => void;
}

type UnhandledRejectionHandler = (event: { reason: unknown }) => void;

class CrashReporter {
  private static instance: CrashReporter;
  private crashes: CrashInfo[] = [];

  static getInstance(): CrashReporter {
    if (!CrashReporter.instance) {
      CrashReporter.instance = new CrashReporter();
    }
    return CrashReporter.instance;
  }

  reportCrash(error: Error, context?: string) {
    const crashInfo: CrashInfo = {
      error,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      stack: error.stack,
    };

    this.crashes.push(crashInfo);

    console.error(`🚨 CRASH REPORTED: ${context || 'Unknown context'}`, {
      message: error.message,
      stack: error.stack,
      timestamp: crashInfo.timestamp,
    });

    if (__DEV__) {
      console.log('📊 All crashes:', this.crashes);
    }
  }

  getCrashes(): CrashInfo[] {
    return [...this.crashes];
  }

  clearCrashes() {
    this.crashes = [];
  }
}

export const crashReporter = CrashReporter.getInstance();

export function setupGlobalErrorHandling() {
  try {
    const globalObj = globalThis as Record<string, unknown>;
    const errorUtils = globalObj.ErrorUtils as ReactNativeErrorUtils | undefined;

    if (errorUtils) {
      const originalHandler = errorUtils.getGlobalHandler();

      errorUtils.setGlobalHandler((error: Error, isFatal: boolean) => {
        crashReporter.reportCrash(error, `Global Error Handler - Fatal: ${isFatal}`);

        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }

    const originalUnhandledRejection = globalObj.onunhandledrejection as
      | UnhandledRejectionHandler
      | undefined;

    globalObj.onunhandledrejection = (event: { reason: unknown }) => {
      const error = new Error(`Unhandled Promise Rejection: ${String(event.reason)}`);
      crashReporter.reportCrash(error, 'Unhandled Promise Rejection');

      if (originalUnhandledRejection) {
        originalUnhandledRejection(event);
      }
    };
  } catch (error) {
    console.error('Failed to setup global error handling:', error);
  }
}
