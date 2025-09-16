import { DIFFICULTY_LEVELS, EQUIPMENT_OPTIONS } from '@/utils/constants';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialEquipment: string[];
  initialDifficulty: 'easy' | 'medium' | 'hard';
  onSave: (settings: { equipment: string[]; difficulty: 'easy' | 'medium' | 'hard' }) => void;
};

export default function SettingsModal({
  visible,
  onClose,
  initialEquipment,
  initialDifficulty,
  onSave,
}: Props) {
  const [equipment, setEquipment] = useState<string[]>(initialEquipment);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initialDifficulty);

  useEffect(() => {
    if (visible) {
      setEquipment(initialEquipment);
      setDifficulty(initialDifficulty);
    }
  }, [visible, initialEquipment, initialDifficulty]);

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const handleSave = () => {
    onSave({ equipment, difficulty });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>

          <Text style={styles.sectionTitle}>Select Equipment:</Text>
          <ScrollView>
            {EQUIPMENT_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleEquipment(item)}
                style={[styles.optionButton, equipment.includes(item) && styles.optionSelected]}
              >
                <Text
                  style={{
                    color: equipment.includes(item) ? 'white' : '#2575fc',
                    fontWeight: '600',
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Difficulty:</Text>
          {DIFFICULTY_LEVELS.map((level) => (
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

          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={handleSave} />
          </View>
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
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 10, marginBottom: 5 },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#2575fc',
    borderRadius: 8,
    marginBottom: 10,
  },
  optionSelected: { backgroundColor: '#2575fc' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
