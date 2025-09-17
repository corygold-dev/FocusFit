import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const callbackRef = useRef<(() => void) | undefined>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      if (callbackRef.current) callbackRef.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
