import { cleanupTimerResources } from '@/src/utils/cleanupTimerResources';
import { act, renderHook } from '@testing-library/react-native';
import { useBackgroundTimer } from '../useBackgroundTimer';

// Mock dependencies
jest.mock('@/src/providers', () => ({
  useBackendData: () => ({
    settings: {
      timerEndNotifications: true,
    },
  }),
}));

jest.mock('@/src/utils/cleanupTimerResources', () => ({
  cleanupTimerResources: jest.fn(),
}));

jest.mock('@/src/utils/constants', () => ({
  TIMER: {
    ONE_SECOND: 1000,
  },
}));

describe('useBackgroundTimer', () => {
  const mockOnScheduleNotification = jest.fn();
  const mockOnCleanup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with null refs', () => {
    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: false,
        secondsLeft: 0,
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    expect(result.current.notificationIdRef.current).toBeNull();
    expect(result.current.endTimeRef.current).toBeNull();
  });

  it('should schedule notification when active with positive seconds', async () => {
    const mockNotificationId = 'notification-123';
    mockOnScheduleNotification.mockResolvedValue(mockNotificationId);

    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 60,
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    expect(result.current.endTimeRef.current).not.toBeNull();
    expect(result.current.notificationIdRef.current).toBe(mockNotificationId);
    expect(mockOnScheduleNotification).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should not schedule notification when inactive', async () => {
    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: false,
        secondsLeft: 60,
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    expect(result.current.endTimeRef.current).toBeNull();
    expect(result.current.notificationIdRef.current).toBeNull();
    expect(mockOnScheduleNotification).not.toHaveBeenCalled();
  });

  it('should not schedule notification when secondsLeft is 0', async () => {
    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 0,
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    expect(result.current.endTimeRef.current).toBeNull();
    expect(result.current.notificationIdRef.current).toBeNull();
    expect(mockOnScheduleNotification).not.toHaveBeenCalled();
  });

  it('should not schedule notification when endTimeRef already exists', async () => {
    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 60,
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    // First call should schedule
    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    const firstEndTime = result.current.endTimeRef.current;
    const firstNotificationId = result.current.notificationIdRef.current;

    // Second call should not schedule
    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    expect(result.current.endTimeRef.current).toBe(firstEndTime);
    expect(result.current.notificationIdRef.current).toBe(firstNotificationId);
    expect(mockOnScheduleNotification).toHaveBeenCalledTimes(1);
  });

  it('should handle notification scheduling errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockOnScheduleNotification.mockRejectedValue(
      new Error('Notification failed')
    );

    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 60,
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    expect(result.current.endTimeRef.current).not.toBeNull();
    expect(result.current.notificationIdRef.current).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to schedule background notification:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should calculate correct end time', async () => {
    const mockNotificationId = 'notification-123';
    mockOnScheduleNotification.mockResolvedValue(mockNotificationId);

    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 120, // 2 minutes
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    const startTime = Date.now();

    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    const expectedEndTime = startTime + 120 * 1000;
    const actualEndTime = result.current.endTimeRef.current;

    // Allow for small timing differences
    expect(actualEndTime).toBeGreaterThanOrEqual(expectedEndTime - 10);
    expect(actualEndTime).toBeLessThanOrEqual(expectedEndTime + 10);
  });

  it('should cleanup background timer correctly', async () => {
    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 60,
        onScheduleNotification: mockOnScheduleNotification,
        onCleanup: mockOnCleanup,
      })
    );

    // Set up some state first
    await act(async () => {
      await result.current.scheduleBackgroundNotification();
    });

    await act(async () => {
      await result.current.cleanupBackgroundTimer();
    });

    expect(cleanupTimerResources).toHaveBeenCalledWith(
      { current: null },
      result.current.notificationIdRef
    );
    expect(result.current.endTimeRef.current).toBeNull();
    expect(mockOnCleanup).toHaveBeenCalled();
  });

  it('should reset background timer correctly', () => {
    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 60,
        onScheduleNotification: mockOnScheduleNotification,
      })
    );

    // Set up some state first
    act(() => {
      result.current.endTimeRef.current = Date.now() + 60000;
    });

    act(() => {
      result.current.resetBackgroundTimer();
    });

    expect(result.current.endTimeRef.current).toBeNull();
  });

  it('should handle cleanup without onCleanup callback', async () => {
    const { result } = renderHook(() =>
      useBackgroundTimer({
        isActive: true,
        secondsLeft: 60,
        onScheduleNotification: mockOnScheduleNotification,
        // No onCleanup provided
      })
    );

    await act(async () => {
      await result.current.cleanupBackgroundTimer();
    });

    expect(cleanupTimerResources).toHaveBeenCalled();
    expect(result.current.endTimeRef.current).toBeNull();
  });

  it('should maintain refs across re-renders', () => {
    const { result, rerender } = renderHook(
      ({ isActive, secondsLeft }: { isActive: boolean; secondsLeft: number }) =>
        useBackgroundTimer({
          isActive,
          secondsLeft,
          onScheduleNotification: mockOnScheduleNotification,
        }),
      {
        initialProps: {
          isActive: true,
          secondsLeft: 60,
        },
      }
    );

    // Set some state
    act(() => {
      result.current.endTimeRef.current = Date.now() + 60000;
      result.current.notificationIdRef.current = 'test-id';
    });

    const endTimeBefore = result.current.endTimeRef.current;
    const notificationIdBefore = result.current.notificationIdRef.current;

    // Re-render with different props
    rerender({
      isActive: false,
      secondsLeft: 30,
    });

    // Refs should persist
    expect(result.current.endTimeRef.current).toBe(endTimeBefore);
    expect(result.current.notificationIdRef.current).toBe(notificationIdBefore);
  });
});
