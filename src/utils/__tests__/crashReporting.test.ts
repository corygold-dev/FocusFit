import { Platform } from 'react-native';
import { crashReporter, setupGlobalErrorHandling } from '../crashReporting';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('crashReporting', () => {
  beforeEach(() => {
    crashReporter.clearCrashes();
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
    (console.log as jest.Mock).mockRestore();
  });

  describe('CrashReporter singleton', () => {
    it('should return the same instance', () => {
      const instance1 = crashReporter;
      const instance2 = crashReporter;

      expect(instance1).toBe(instance2);
    });
  });

  describe('reportCrash', () => {
    it('should report crash with error details', () => {
      const error = new Error('Test error');
      error.stack = 'Test stack trace';

      crashReporter.reportCrash(error, 'Test context');

      const crashes = crashReporter.getCrashes();
      expect(crashes).toHaveLength(1);
      expect(crashes[0].error).toBe(error);
      expect(crashes[0].platform).toBe('ios');
      expect(crashes[0].stack).toBe('Test stack trace');
      expect(crashes[0].timestamp).toBeDefined();
    });

    it('should log crash to console with context', () => {
      const error = new Error('Console test error');

      crashReporter.reportCrash(error, 'Console context');

      expect(console.error).toHaveBeenCalledWith(
        '🚨 CRASH REPORTED: Console context',
        expect.objectContaining({
          message: 'Console test error',
          timestamp: expect.any(String),
        })
      );
    });

    it('should use default context when not provided', () => {
      const error = new Error('No context error');

      crashReporter.reportCrash(error);

      expect(console.error).toHaveBeenCalledWith(
        '🚨 CRASH REPORTED: Unknown context',
        expect.any(Object)
      );
    });

    it('should store multiple crashes', () => {
      const error1 = new Error('Error 1');
      const error2 = new Error('Error 2');
      const error3 = new Error('Error 3');

      crashReporter.reportCrash(error1);
      crashReporter.reportCrash(error2);
      crashReporter.reportCrash(error3);

      const crashes = crashReporter.getCrashes();
      expect(crashes).toHaveLength(3);
      expect(crashes[0].error.message).toBe('Error 1');
      expect(crashes[1].error.message).toBe('Error 2');
      expect(crashes[2].error.message).toBe('Error 3');
    });

    it('should include platform information', () => {
      (Platform as { OS: string }).OS = 'android';
      const error = new Error('Platform test');

      crashReporter.reportCrash(error);

      const crashes = crashReporter.getCrashes();
      expect(crashes[0].platform).toBe('android');

      (Platform as { OS: string }).OS = 'ios';
    });

    it('should handle errors without stack trace', () => {
      const error = new Error('No stack');
      delete error.stack;

      crashReporter.reportCrash(error);

      const crashes = crashReporter.getCrashes();
      expect(crashes).toHaveLength(1);
      expect(crashes[0].stack).toBeUndefined();
    });

    it('should create valid ISO timestamp', () => {
      const error = new Error('Timestamp test');

      crashReporter.reportCrash(error);

      const crashes = crashReporter.getCrashes();
      const timestamp = new Date(crashes[0].timestamp);
      expect(timestamp.toISOString()).toBe(crashes[0].timestamp);
    });
  });

  describe('getCrashes', () => {
    it('should return empty array when no crashes', () => {
      const crashes = crashReporter.getCrashes();
      expect(crashes).toEqual([]);
    });

    it('should return copy of crashes array', () => {
      const error = new Error('Original error');
      crashReporter.reportCrash(error);

      const crashes1 = crashReporter.getCrashes();
      const crashes2 = crashReporter.getCrashes();

      expect(crashes1).not.toBe(crashes2);
      expect(crashes1).toEqual(crashes2);
    });

    it('should not allow external modification of crashes', () => {
      const error = new Error('Protected error');
      crashReporter.reportCrash(error);

      const crashes = crashReporter.getCrashes();
      crashes.pop();

      const actualCrashes = crashReporter.getCrashes();
      expect(actualCrashes).toHaveLength(1);
    });
  });

  describe('clearCrashes', () => {
    it('should clear all crashes', () => {
      crashReporter.reportCrash(new Error('Error 1'));
      crashReporter.reportCrash(new Error('Error 2'));

      expect(crashReporter.getCrashes()).toHaveLength(2);

      crashReporter.clearCrashes();

      expect(crashReporter.getCrashes()).toHaveLength(0);
    });

    it('should allow reporting new crashes after clearing', () => {
      crashReporter.reportCrash(new Error('Before clear'));
      crashReporter.clearCrashes();
      crashReporter.reportCrash(new Error('After clear'));

      const crashes = crashReporter.getCrashes();
      expect(crashes).toHaveLength(1);
      expect(crashes[0].error.message).toBe('After clear');
    });
  });

  describe('setupGlobalErrorHandling', () => {
    it('should setup error handling without throwing', () => {
      expect(() => setupGlobalErrorHandling()).not.toThrow();
    });
  });
});
