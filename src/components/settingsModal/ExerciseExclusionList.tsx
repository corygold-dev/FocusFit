import { useTheme } from '@/src/providers';
import { CATEGORY_LABELS, CategoryKey } from '@/src/utils/constants';
import { countExcludedExercises, getFilteredExercisesByCategory } from '@/src/utils/exerciseUtils';
import _ from 'lodash';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { exerciseExclusionListStyles } from './styles';

type ExerciseExclusionListProps = {
  excludedExercises: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  onChange: (excludedExercises: string[]) => void;
};

export default function ExerciseExclusionList({
  excludedExercises,
  difficulty,
  equipment,
  onChange,
}: ExerciseExclusionListProps) {
  const { theme, isDark } = useTheme();
  const styles = exerciseExclusionListStyles(theme, isDark);

  const [showExcludedExercises, setShowExcludedExercises] = useState(false);

  const filteredExercisesByCategory = useMemo(
    () => getFilteredExercisesByCategory(difficulty, equipment),
    [difficulty, equipment],
  );

  const excludedExercisesCount = useMemo(
    () => countExcludedExercises(excludedExercises, difficulty, equipment),
    [excludedExercises, difficulty, equipment],
  );

  const toggleExerciseExclusion = (exerciseName: string) => {
    const updatedExercises = _.includes(excludedExercises, exerciseName)
      ? _.without(excludedExercises, exerciseName)
      : [...excludedExercises, exerciseName];

    onChange(updatedExercises);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowExcludedExercises(!showExcludedExercises)}
      >
        <Text style={styles.dropdownText}>
          {showExcludedExercises ? 'Hide Excluded' : 'Show Excluded'}
          {excludedExercisesCount > 0 ? ` (${excludedExercisesCount})` : ''}
        </Text>
        {showExcludedExercises ? (
          <ChevronUp size={20} color={theme.colors.text} />
        ) : (
          <ChevronDown size={20} color={theme.colors.text} />
        )}
      </TouchableOpacity>

      {showExcludedExercises && (
        <View style={styles.content}>
          <Text style={styles.helpText}>
            Toggle off exercises you don't want to include in your workouts. Only showing exercises
            for {_.capitalize(difficulty)} difficulty that match your selected equipment.
          </Text>

          {_.map(_.toPairs(filteredExercisesByCategory), ([categoryKey, categoryExercises]) => {
            const category = categoryKey as CategoryKey;

            if (categoryExercises.length === 0) return null;

            return (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{CATEGORY_LABELS[category]}</Text>
                {_.map(categoryExercises, (exercise) => (
                  <View key={exercise.name} style={styles.exerciseRow}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Switch
                      value={!_.includes(excludedExercises, exercise.name)}
                      onValueChange={() => toggleExerciseExclusion(exercise.name)}
                      trackColor={{
                        false: theme.colors.error,
                        true: theme.colors.accent,
                      }}
                      thumbColor={theme.colors.switchThumb}
                    />
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
