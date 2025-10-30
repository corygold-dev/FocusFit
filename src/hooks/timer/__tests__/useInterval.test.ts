import { renderHook } from '@testing-library/react-native';
import { useInterval } from '../useInterval';

describe('useInterval', () => {
  jest.setTimeout(5000);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should call callback at specified interval', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not call callback when delay is null', () => {
    const callback = jest.fn();
    renderHook(() => useInterval(callback, null));

    jest.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should update callback without restarting interval', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { rerender } = renderHook(
      ({ cb }: { cb: () => void }) => useInterval(cb, 1000),
      {
        initialProps: { cb: callback1 },
      }
    );

    jest.advanceTimersByTime(1000);
    expect(callback1).toHaveBeenCalledTimes(1);

    rerender({ cb: callback2 });

    jest.advanceTimersByTime(1000);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should restart interval when delay changes', () => {
    const callback = jest.fn();

    const { rerender } = renderHook(
      ({ delay }: { delay: number }) => useInterval(callback, delay),
      { initialProps: { delay: 1000 } }
    );

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ delay: 500 });

    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should cleanup interval on unmount', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
