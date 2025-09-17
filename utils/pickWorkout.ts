import _ from 'lodash';
import { Exercise, exercises } from '../app/lib/exercises';

type UserSettings = {
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  excludedExercises: string[];
};

export function pickWorkout(userSettings: UserSettings): Exercise[] {
  const { difficulty, equipment, excludedExercises } = userSettings;

  const filteredExercises = _.filter(exercises, (e) => {
    const difficultyMatches = e.difficulty.includes(difficulty);
    const equipmentMatches = !e.equipment || _.every(e.equipment, (eq) => equipment.includes(eq));
    const notExcluded = !excludedExercises.includes(e.name);
    return difficultyMatches && equipmentMatches && notExcluded;
  });

  const nonMobility = _.filter(filteredExercises, (e) => e.category !== 'mobility');

  const [first] = _.sampleSize(nonMobility, 1);

  const [second] = _.sampleSize(
    _.filter(nonMobility, (e) => e.category !== first?.category),
    1,
  );

  const [mobility] = _.sampleSize(
    _.filter(exercises, (e) => e.category === 'mobility' && !excludedExercises.includes(e.name)),
    1,
  );

  return [first, second, mobility].filter(Boolean);
}
