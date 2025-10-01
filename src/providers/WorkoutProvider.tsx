import React, { createContext, ReactNode, useContext, useState } from 'react';

type WorkoutType = 'strength' | 'mobility' | null;

interface WorkoutContextType {
  workoutType: WorkoutType;
  setWorkoutType: (type: WorkoutType) => void;
  clearWorkoutType: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

interface WorkoutProviderProps {
  children: ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>(null);

  const clearWorkoutType = () => setWorkoutType(null);

  const value: WorkoutContextType = {
    workoutType,
    setWorkoutType,
    clearWorkoutType,
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

export const useWorkoutType = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutType must be used within a WorkoutProvider');
  }
  return context;
};
