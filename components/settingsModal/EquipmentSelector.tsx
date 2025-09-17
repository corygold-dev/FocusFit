import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';
import _ from 'lodash';
import { createStyles } from './styles/equipmentSelector.styles';

type EquipmentSelectorProps = {
  equipment: string[];
  options: string[];
  onChange: (equipment: string[]) => void;
};

export default function EquipmentSelector({
  equipment,
  options,
  onChange,
}: EquipmentSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const toggleEquipment = useCallback(
    (item: string) => {
      onChange(_.includes(equipment, item) ? _.without(equipment, item) : [...equipment, item]);
    },
    [equipment, onChange],
  );

  return (
    <View style={styles.container}>
      {_.map(options, (item) => (
        <TouchableOpacity
          key={item}
          onPress={() => toggleEquipment(item)}
          style={[styles.equipmentButton, _.includes(equipment, item) && styles.optionSelected]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: _.includes(equipment, item) }}
          accessibilityLabel={`${item} equipment${_.includes(equipment, item) ? ', selected' : ''}`}
        >
          <Text
            style={[styles.optionText, _.includes(equipment, item) && styles.optionTextSelected]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
