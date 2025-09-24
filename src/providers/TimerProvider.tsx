import React, { createContext, ReactNode, useContext, useState } from 'react';

interface TimerContextType {
  shouldAutoStart: boolean;
  setShouldAutoStart: (value: boolean) => void;
  clearAutoStart: () => void;
  selectedFocusTime: number | null;
  setSelectedFocusTime: (time: number | null) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  const [selectedFocusTime, setSelectedFocusTime] = useState<number | null>(null);

  const clearAutoStart = () => setShouldAutoStart(false);

  return (
    <TimerContext.Provider
      value={{
        shouldAutoStart,
        setShouldAutoStart,
        clearAutoStart,
        selectedFocusTime,
        setSelectedFocusTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within TimerProvider');
  }
  return context;
};
