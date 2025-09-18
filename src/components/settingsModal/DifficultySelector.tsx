import { useTheme } from '@/src/providers';
import { Difficulty } from '@/src/utils/constants';
import _ from 'lodash';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { difficultySelectorStyles } from './styles';

type DifficultySelectorProps = {
  difficulty: Difficulty;
  options: string[];
  onChange: (difficulty: Difficulty) => void;
};

export default function DifficultySelector({
  difficulty,
  options,
  onChange,
}: DifficultySelectorProps) {
  const { theme } = useTheme();
  const styles = difficultySelectorStyles(theme);

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.dropdownText}>{_.capitalize(difficulty)}</Text>
        {showDropdown ? (
          <ChevronUp size={20} color={theme.colors.text} />
        ) : (
          <ChevronDown size={20} color={theme.colors.text} />
        )}
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownMenu}>
          {_.map(options, (level) => (
            <TouchableOpacity
              key={level}
              style={[styles.dropdownOption, level === difficulty && styles.dropdownOptionSelected]}
              onPress={() => {
                onChange(level as Difficulty);
                setShowDropdown(false);
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
  );
}
