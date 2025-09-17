import { DIFFICULTY_LEVELS, EQUIPMENT_OPTIONS } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import { Button, Modal, ScrollView, Text, View } from 'react-native';
import DifficultySelector from './DifficultySelector';
import EquipmentSelector from './EquipmentSelector';
import ExerciseExclusionList from './ExerciseExclusionList';
import ThemeSelector from './ThemeSelector';
import { settingsModalStyles } from './styles';
import { useTheme } from '@/app/providers';

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

export default function SettingsModal({
  visible,
  onClose,
  initialEquipment,
  initialDifficulty,
  initialExcludedExercises = [],
  onSave,
}: Props) {
  const { theme, themeMode, setThemeMode } = useTheme();
  const styles = settingsModalStyles(theme);

  const [equipment, setEquipment] = useState<string[]>(initialEquipment);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialDifficulty);
  const [excludedExercises, setExcludedExercises] = useState<string[]>(initialExcludedExercises);

  useEffect(() => {
    if (visible) {
      setEquipment(initialEquipment);
      setDifficulty(initialDifficulty);
      setExcludedExercises(initialExcludedExercises);
    }
  }, [visible, initialEquipment, initialDifficulty, initialExcludedExercises]);

  const handleSave = () => {
    onSave({ equipment, difficulty, excludedExercises });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.modalTitle}>Settings</Text>

              <Text style={styles.sectionTitle}>Theme:</Text>
              <ThemeSelector currentTheme={themeMode} onThemeChange={setThemeMode} />

              <Text style={styles.sectionTitle}>Select Equipment:</Text>
              <EquipmentSelector
                equipment={equipment}
                options={EQUIPMENT_OPTIONS}
                onChange={setEquipment}
              />

              <Text style={styles.sectionTitle}>Difficulty:</Text>
              <DifficultySelector
                difficulty={difficulty}
                options={DIFFICULTY_LEVELS}
                onChange={setDifficulty}
              />

              <Text style={styles.sectionTitle}>Excluded Exercises:</Text>
              <ExerciseExclusionList
                excludedExercises={excludedExercises}
                difficulty={difficulty}
                onChange={setExcludedExercises}
              />
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
