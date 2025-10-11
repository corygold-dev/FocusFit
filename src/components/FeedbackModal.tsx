import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../providers';
import { FEEDBACK_CATEGORIES, USER_TYPES } from '../utils/constants';
import { feedbackModalStyles } from './FeedbackModal/styles';

interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  userType: string;
}

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export default function FeedbackModal({
  visible,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const { theme } = useTheme();
  const styles = feedbackModalStyles(theme);

  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('');

  const handleSubmit = (): void => {
    if (!category || !message.trim() || !userType) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const feedback: FeedbackData = {
      rating,
      category,
      message: message.trim(),
      userType,
    };

    onSubmit(feedback);

    setRating(0);
    setCategory('');
    setMessage('');
    setUserType('');

    onClose();

    Alert.alert('Thank You!', 'Your feedback has been submitted.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Share Your Feedback</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>
              How would you rate FocusFit?
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => setRating(star)}
                >
                  <MaterialIcons
                    name={star <= rating ? 'star' : 'star-border'}
                    size={32}
                    color={
                      star <= rating ? '#FFD700' : theme.colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>
              What type of feedback is this?
            </Text>
            <View style={styles.categoryContainer}>
              {FEEDBACK_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.id && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <MaterialIcons
                    name={cat.icon as keyof typeof MaterialIcons.glyphMap}
                    size={16}
                    color={category === cat.id ? '#FFFFFF' : theme.colors.text}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.id && styles.selectedCategoryText,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>
              How often do you use FocusFit?
            </Text>
            <View style={styles.userTypeContainer}>
              {USER_TYPES.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.userTypeButton,
                    userType === type.id && styles.selectedUserType,
                  ]}
                  onPress={() => setUserType(type.id)}
                >
                  <Text
                    style={[
                      styles.userTypeText,
                      userType === type.id && styles.selectedUserTypeText,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Tell us more (required)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Describe your feedback, suggestions, or issues..."
              placeholderTextColor={theme.colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
