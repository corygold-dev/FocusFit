import _ from 'lodash';
import { Exercise, exercises } from '../app/lib/exercises';

type UserSettings = {
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
};

export function pickWorkout(userSettings: UserSettings): Exercise[] {
  const { difficulty, equipment } = userSettings;

  const filteredExercises = _.filter(exercises, (e) => {
    const difficultyMatches = e.difficulty.includes(difficulty);
    const equipmentMatches = !e.equipment || _.every(e.equipment, (eq) => equipment.includes(eq));
    return difficultyMatches && equipmentMatches;
  });

  const nonMobility = _.filter(filteredExercises, (e) => e.category !== 'mobility');

  const [first] = _.sampleSize(nonMobility, 1);

  const [second] = _.sampleSize(
    _.filter(nonMobility, (e) => e.category !== first.category),
    1,
  );

  const [mobility] = _.sampleSize(
    _.filter(exercises, (e) => e.category === 'mobility'),
    1,
  );

  return [first, second, mobility];
}
