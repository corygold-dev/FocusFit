import { exercises } from '@/app/lib/exercises';
import { DIFFICULTY_LEVELS, EQUIPMENT_OPTIONS } from '@/utils/constants';
import _ from 'lodash';
import { ArrowLeft } from 'lucide-react-native';
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
  const [equipment, setEquipment] = useState<string[]>(initialEquipment);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialDifficulty);
  const [excludedExercises, setExcludedExercises] = useState<string[]>(initialExcludedExercises);
  const [showExcludeMenu, setShowExcludeMenu] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setEquipment(initialEquipment);
      setDifficulty(initialDifficulty);
      setExcludedExercises(initialExcludedExercises);
      setShowExcludeMenu(false);
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

  const mainSettingsContent = (
    <View style={styles.mainContainer}>
      <Text style={styles.modalTitle}>Settings</Text>

      <Text style={styles.sectionTitle}>Select Equipment:</Text>
      <ScrollView>
        {_.map(EQUIPMENT_OPTIONS, (item) => (
          <TouchableOpacity
            key={item}
            onPress={() => toggleEquipment(item)}
            style={[styles.optionButton, _.includes(equipment, item) && styles.optionSelected]}
          >
            <Text
              style={{
                color: _.includes(equipment, item) ? 'white' : '#2575fc',
                fontWeight: '600',
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Difficulty:</Text>
      {_.map(DIFFICULTY_LEVELS, (level) => (
        <TouchableOpacity
          key={level}
          onPress={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
          style={[styles.optionButton, difficulty === level && styles.optionSelected]}
        >
          <Text
            style={{
              color: difficulty === level ? 'white' : '#2575fc',
              fontWeight: '600',
            }}
          >
            {_.capitalize(level)}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.excludeButton} onPress={() => setShowExcludeMenu(true)}>
        <Text style={styles.excludeButtonText}>
          Excluded Exercises {excludedExercises.length > 0 ? `(${excludedExercises.length})` : ''}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={onClose} />
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, showExcludeMenu && styles.excludeModalContent]}>
          {showExcludeMenu ? (
            <View style={styles.excludeContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => setShowExcludeMenu(false)}>
                <View style={styles.backButtonContent}>
                  <ArrowLeft size={24} color="#2575fc" />
                  <Text style={styles.backText}>Back</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.excludeTitle}>Exclude Exercises</Text>

              <Text style={styles.helpText}>
                Toggle off exercises you don't want to include in your workouts.
              </Text>

              <ScrollView style={styles.exercisesScrollView}>
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
                            trackColor={{ false: '#ff6b6b', true: '#4cd964' }}
                          />
                        </View>
                      ))}
                    </View>
                  );
                })}
              </ScrollView>

              <View style={styles.buttonRow}>
                <Button title="Cancel" onPress={onClose} />
                <Button title="Save" onPress={handleSave} />
              </View>
            </View>
          ) : (
            mainSettingsContent
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  modalContent: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: 'white',
    borderRadius: 12,
    height: '75%',
    justifyContent: 'space-around',
  },
  excludeModalContent: {
    height: '75%',
    padding: 0,
  },
  excludeContainer: {
    flex: 1,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  exercisesScrollView: {
    flex: 1,
    marginVertical: 10,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#2575fc',
    borderRadius: 8,
    marginBottom: 10,
  },
  excludeContentContainer: {
    flex: 1,
    width: '100%',
  },
  optionSelected: {
    backgroundColor: '#2575fc',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  excludeButton: {
    marginTop: 20,
    backgroundColor: '#eef3fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  excludeButtonText: {
    color: '#2575fc',
    fontWeight: '600',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
    height: 40,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#2575fc',
    fontSize: 16,
    marginLeft: 5,
  },
  excludeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
    backgroundColor: '#f5f5f5',
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
    borderBottomColor: '#ddd',
  },
  exerciseName: {
    fontSize: 16,
    flex: 1,
  },
});
