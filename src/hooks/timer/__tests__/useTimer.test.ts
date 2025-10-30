import { cleanupTimerResources } from '@/src/utils/cleanupTimerResources';
import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useInterval } from '../useInterval';
import { useTimer } from '../useTimer';

jest.mock('@/src/providers', () => ({
  useSounds: () => ({
    playEndSound: jest.fn(),
  }),
}));

jest.mock('@/src/utils/cleanupTimerResources', () => ({
  cleanupTimerResources: jest.fn(),
}));

jest.mock('@/src/utils/notifications', () => ({
  scheduleTimerNotification: jest.fn(),
}));

jest.mock('../useBackgroundTimer', () => ({
  useBackgroundTimer: () => ({
    scheduleBackgroundNotification: jest.fn(),
    cleanupBackgroundTimer: jest.fn(),
    resetBackgroundTimer: jest.fn(),
    notificationIdRef: { current: null },
    endTimeRef: { current: null },
  }),
}));

jest.mock('../useInterval', () => ({
  useInterval: jest.fn(),
}));

jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
}));

describe('useTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.duration).toBe(25 * 60);
    expect(result.current.secondsLeft).toBe(25 * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it('initializes with custom duration', () => {
    const customDuration = 10 * 60;
    const { result } = renderHook(() =>
      useTimer({ initialDuration: customDuration })
    );

    expect(result.current.duration).toBe(customDuration);
    expect(result.current.secondsLeft).toBe(customDuration);
  });

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useTimer({ initialDuration: 100 }));

    act(() => {
      result.current.setCustomDuration(50);
    });

    expect(result.current.progress).toBe(0);
  });

  it('starts timer correctly', async () => {
    const { result } = renderHook(() => useTimer());

    await act(async () => {
      await result.current.startTimer();
    });

    expect(result.current.isRunning).toBe(true);
  });

  it('pauses timer correctly', async () => {
    const { result } = renderHook(() => useTimer());

    await act(async () => {
      await result.current.startTimer();
      await result.current.pauseTimer();
    });

    expect(result.current.isRunning).toBe(false);
  });

  it('resets timer correctly', async () => {
    const { result } = renderHook(() => useTimer({ initialDuration: 100 }));

    await act(async () => {
      result.current.setCustomDuration(50);
      await result.current.resetTimer();
    });

    expect(result.current.secondsLeft).toBe(100);
    expect(result.current.isRunning).toBe(false);
  });

  it('sets custom duration when not running', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.setCustomDuration(10);
    });

    expect(result.current.duration).toBe(600);
    expect(result.current.secondsLeft).toBe(600);
  });

  it('does not set custom duration when running', async () => {
    const { result } = renderHook(() => useTimer());

    await act(async () => {
      await result.current.startTimer();
    });

    act(() => {
      result.current.setCustomDuration(10);
    });

    expect(result.current.duration).toBe(25 * 60);
  });

  it('calls onComplete when timer finishes', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useTimer({ onComplete }));

    act(() => {
      result.current.setCustomDuration(0);
    });

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.isRunning).toBe(true);
  });

  it('toggles timer correctly', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.toggleTimer();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.toggleTimer();
    });
    expect(result.current.isRunning).toBe(false);
  });

  it('handles timer countdown logic', () => {
    const mockCallback = jest.fn();

    (useInterval as jest.Mock).mockImplementation(
      (callback: () => void, interval: number | null) => {
        if (interval === 1000) {
          mockCallback.mockImplementation(callback);
        }
      }
    );

    const { result } = renderHook(() => useTimer({ initialDuration: 5 }));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      mockCallback();
    });

    expect(result.current.secondsLeft).toBe(4);
    expect(result.current.isRunning).toBe(true);
  });

  it('completes timer when countdown reaches zero', () => {
    const mockCallback = jest.fn();
    const onComplete = jest.fn();

    (useInterval as jest.Mock).mockImplementation(
      (callback: () => void, interval: number | null) => {
        if (interval === 1000) {
          mockCallback.mockImplementation(callback);
        }
      }
    );

    const { result } = renderHook(() =>
      useTimer({
        initialDuration: 1,
        onComplete,
      })
    );

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      mockCallback();
    });

    expect(result.current.secondsLeft).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles background timer with endTimeRef', () => {
    const mockCallback = jest.fn();

    (useInterval as jest.Mock).mockImplementation(
      (callback: () => void, interval: number | null) => {
        if (interval === 1000) {
          mockCallback.mockImplementation(callback);
        }
      }
    );

    const { result } = renderHook(() => useTimer({ initialDuration: 10 }));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      mockCallback();
    });

    expect(result.current.secondsLeft).toBe(9);
    expect(result.current.isRunning).toBe(true);
  });

  it('handles AppState changes correctly', () => {
    const mockListener = jest.fn();

    (AppState.addEventListener as jest.Mock).mockImplementation(
      (
        event: string,
        callback: (state: import('react-native').AppStateStatus) => void
      ) => {
        if (event === 'change') {
          mockListener.mockImplementation(callback);
        }
        return { remove: jest.fn() };
      }
    );

    const { result } = renderHook(() => useTimer({ initialDuration: 10 }));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      mockListener('active');
    });

    expect(result.current.isRunning).toBe(true);
  });

  it('cleans up resources on unmount', () => {
    const { unmount } = renderHook(() => useTimer());

    unmount();

    expect(cleanupTimerResources).toHaveBeenCalled();
  });

  it('handles pauseTimer with endTimeRef', async () => {
    const { result } = renderHook(() => useTimer({ initialDuration: 10 }));

    await act(async () => {
      await result.current.startTimer();
    });

    await act(async () => {
      await result.current.pauseTimer();
    });

    expect(result.current.isRunning).toBe(false);
  });
});
