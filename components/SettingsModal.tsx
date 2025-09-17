import { exercises } from '@/app/lib/exercises';
import { useTheme } from '@/app/providers/ThemeProvider';
import { DIFFICULTY_LEVELS, EQUIPMENT_OPTIONS } from '@/utils/constants';
import _ from 'lodash';
import { ChevronDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialEquipment: string[];
  initialDifficulty: 'easy' | 'medium' | 'hard';
  initialExcludedExercises: string[];
  onSave: (settings: {
    equipment: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    excludedExercises: string[];
  }) => void;
};

type CategoryKey = 'upper' | 'lower' | 'full' | 'mobility';

export default function SettingsModal({
  visible,
  onClose,
  initialEquipment,
  initialDifficulty,
  initialExcludedExercises = [],
  onSave,
}: Props) {
  const { theme, isDark } = useTheme();
  const [equipment, setEquipment] = useState<string[]>(initialEquipment);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialDifficulty);
  const [excludedExercises, setExcludedExercises] = useState<string[]>(initialExcludedExercises);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setEquipment(initialEquipment);
      setDifficulty(initialDifficulty);
      setExcludedExercises(initialExcludedExercises);
      setShowDifficultyDropdown(false);
    }
  }, [visible, initialEquipment, initialDifficulty, initialExcludedExercises]);

  const toggleEquipment = (item: string) => {
    setEquipment((prev) => (_.includes(prev, item) ? _.without(prev, item) : [...prev, item]));
  };

  const toggleExerciseExclusion = (exerciseName: string) => {
    setExcludedExercises((prev) =>
      _.includes(prev, exerciseName) ? _.without(prev, exerciseName) : [...prev, exerciseName],
    );
  };

  const handleSave = () => {
    onSave({ equipment, difficulty, excludedExercises });
    onClose();
  };

  const exercisesByCategory = _.groupBy(exercises, 'category');
  const categories: Record<CategoryKey, string> = {
    upper: 'Upper Body',
    lower: 'Lower Body',
    full: 'Full Body',
    mobility: 'Mobility',
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxWidth: 450,
      backgroundColor: theme.colors.modalBackground,
      borderRadius: 12,
      height: '80%',
      overflow: 'hidden',
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 10,
      color: theme.colors.text,
    },
    equipmentContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    equipmentButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      margin: 5,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionText: {
      fontWeight: '600',
      color: theme.colors.primary,
    },
    optionTextSelected: {
      color: '#ffffff',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.modalBackground,
    },
    helpText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 15,
      textAlign: 'center',
    },
    categorySection: {
      marginBottom: 15,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: 5,
      backgroundColor: isDark ? theme.colors.surfaceVariant : '#F0F4F8',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 4,
    },
    exerciseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    exerciseName: {
      fontSize: 16,
      flex: 1,
      color: theme.colors.text,
    },
    dropdownContainer: {
      position: 'relative',
      zIndex: 10,
    },
    dropdownButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceVariant,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: theme.colors.modalBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      marginTop: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 20,
    },
    dropdownOption: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    dropdownOptionSelected: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    dropdownOptionText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    dropdownOptionTextSelected: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    excludedExercisesSection: {
      marginTop: 20,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.modalTitle}>Settings</Text>

              <Text style={styles.sectionTitle}>Select Equipment:</Text>
              <View style={styles.equipmentContainer}>
                {_.map(EQUIPMENT_OPTIONS, (item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggleEquipment(item)}
                    style={[
                      styles.equipmentButton,
                      _.includes(equipment, item) && styles.optionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        _.includes(equipment, item) && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Difficulty:</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                >
                  <Text style={styles.dropdownText}>{_.capitalize(difficulty)}</Text>
                  <ChevronDown size={20} color={theme.colors.text} />
                </TouchableOpacity>

                {showDifficultyDropdown && (
                  <View style={styles.dropdownMenu}>
                    {_.map(DIFFICULTY_LEVELS, (level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.dropdownOption,
                          level === difficulty && styles.dropdownOptionSelected,
                        ]}
                        onPress={() => {
                          setDifficulty(level as 'easy' | 'medium' | 'hard');
                          setShowDifficultyDropdown(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            level === difficulty && styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {_.capitalize(level)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.excludedExercisesSection}>
                <Text style={styles.sectionTitle}>
                  Excluded Exercises{' '}
                  {excludedExercises.length > 0 ? `(${excludedExercises.length})` : ''}:
                </Text>
                <Text style={styles.helpText}>
                  Toggle off exercises you don't want to include in your workouts.
                </Text>

                {_.map(_.toPairs(exercisesByCategory), ([categoryKey, categoryExercises]) => {
                  const category = categoryKey as CategoryKey;

                  return (
                    <View key={category} style={styles.categorySection}>
                      <Text style={styles.categoryTitle}>{categories[category]}</Text>
                      {_.map(categoryExercises, (exercise) => (
                        <View key={exercise.name} style={styles.exerciseRow}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Switch
                            value={!_.includes(excludedExercises, exercise.name)}
                            onValueChange={() => toggleExerciseExclusion(exercise.name)}
                            trackColor={{
                              false: theme.colors.error,
                              true: theme.colors.success,
                            }}
                            thumbColor={theme.colors.switchThumb}
                          />
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} color={theme.colors.textSecondary} />
            <Button title="Save" onPress={handleSave} color={theme.colors.primary} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
