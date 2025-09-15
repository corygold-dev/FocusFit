// app/lib/exercises.ts
export type Exercise = {
  name: string;
  category: 'upperBody' | 'lowerBody' | 'fullBody' | 'stretch';
  duration: number;
};

export const exercises: Exercise[] = [
  { name: 'Push-ups', category: 'upperBody', duration: 30 },
  { name: 'Chair Dips', category: 'upperBody', duration: 30 },
  { name: 'Squats', category: 'lowerBody', duration: 30 },
  { name: 'Hip Bridges', category: 'lowerBody', duration: 30 },
  { name: 'Plank', category: 'fullBody', duration: 30 },
  { name: 'Jumping Jacks', category: 'fullBody', duration: 30 },
  { name: 'Hamstring Stretch', category: 'stretch', duration: 60 },
  { name: 'Shoulder Stretch', category: 'stretch', duration: 60 },
  { name: 'Quad Stretch', category: 'stretch', duration: 60 },
];
