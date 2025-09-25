import { useAuth, useTheme } from '@/src/providers';
import { DIFFICULTY_LEVELS, EQUIPMENT_OPTIONS } from '@/src/utils/constants';
import { UserSettings } from '@/src/utils/exerciseUtils';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DifficultySelector from './DifficultySelector';
import EquipmentSelector from './EquipmentSelector';
import ExerciseExclusionList from './ExerciseExclusionList';
import NotificationSettings from './NotificationSettings';
import ThemeSelector from './ThemeSelector';
import { settingsModalStyles } from './styles';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  initialEquipment: string[];
  initialDifficulty: UserSettings['difficulty'];
  initialExcludedExercises: string[];
  onSave: (settings: UserSettings) => void;
}

export default function SettingsModal({
  visible,
  onClose,
  initialEquipment,
  initialDifficulty,
  initialExcludedExercises = [],
  onSave,
}: SettingsModalProps) {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { logout } = useAuth();
  const styles = settingsModalStyles(theme);

  const [equipment, setEquipment] = useState<string[]>(initialEquipment);
  const [difficulty, setDifficulty] = useState<UserSettings['difficulty']>(initialDifficulty);
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

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        logout();
      }
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]);
    }
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

              <Text style={styles.sectionTitle}>Daily Reminders:</Text>
              <NotificationSettings />

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
                equipment={equipment}
                onChange={setExcludedExercises}
              />

              <View style={styles.logoutSection}>
                <Text style={styles.sectionTitle}>Account:</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
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
