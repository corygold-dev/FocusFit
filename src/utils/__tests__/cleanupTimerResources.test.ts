import { cleanupTimerResources } from '../cleanupTimerResources';
import * as notifications from '../notifications';

jest.mock('../notifications', () => ({
  cancelNotification: jest.fn(),
}));

describe('cleanupTimerResources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear interval when intervalRef is not null', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const intervalRef = { current: 123 };
    const notificationIdRef = { current: null };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    expect(intervalRef.current).toBeNull();
  });

  it('should not clear interval when intervalRef is null', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const intervalRef = { current: null };
    const notificationIdRef = { current: null };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(clearIntervalSpy).not.toHaveBeenCalled();
    expect(intervalRef.current).toBeNull();
  });

  it('should cancel notification when notificationIdRef is not null', async () => {
    const intervalRef = { current: null };
    const notificationIdRef = { current: 'notification-123' };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(notifications.cancelNotification).toHaveBeenCalledWith(
      'notification-123'
    );
    expect(notificationIdRef.current).toBeNull();
  });

  it('should not cancel notification when notificationIdRef is null', async () => {
    const intervalRef = { current: null };
    const notificationIdRef = { current: null };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(notifications.cancelNotification).not.toHaveBeenCalled();
    expect(notificationIdRef.current).toBeNull();
  });

  it('should clean up both interval and notification', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const intervalRef = { current: 456 };
    const notificationIdRef = { current: 'notification-456' };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(clearIntervalSpy).toHaveBeenCalledWith(456);
    expect(intervalRef.current).toBeNull();
    expect(notifications.cancelNotification).toHaveBeenCalledWith(
      'notification-456'
    );
    expect(notificationIdRef.current).toBeNull();
  });

  it('should handle notification cancellation errors gracefully', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockError = new Error('Failed to cancel');
    (notifications.cancelNotification as jest.Mock).mockRejectedValue(
      mockError
    );

    const intervalRef = { current: null };
    const notificationIdRef = { current: 'notification-error' };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to cancel notification:',
      mockError
    );
    expect(notificationIdRef.current).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should still set notificationIdRef to null even when cancellation fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (notifications.cancelNotification as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const intervalRef = { current: null };
    const notificationIdRef = { current: 'notification-fail' };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(notificationIdRef.current).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should clear interval even if notification cancellation fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    (notifications.cancelNotification as jest.Mock).mockRejectedValue(
      new Error('Cancel failed')
    );

    const intervalRef = { current: 789 };
    const notificationIdRef = { current: 'notification-789' };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(clearIntervalSpy).toHaveBeenCalledWith(789);
    expect(intervalRef.current).toBeNull();
    expect(notificationIdRef.current).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should handle zero as valid interval id', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const intervalRef = { current: 0 };
    const notificationIdRef = { current: null };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(clearIntervalSpy).toHaveBeenCalledWith(0);
    expect(intervalRef.current).toBeNull();
  });

  it('should call cancelNotification even with empty string id', async () => {
    const intervalRef = { current: null };
    const notificationIdRef = { current: '' };

    await cleanupTimerResources(intervalRef, notificationIdRef);

    expect(notifications.cancelNotification).toHaveBeenCalledWith('');
    expect(notificationIdRef.current).toBeNull();
  });
});
