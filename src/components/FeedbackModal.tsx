import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../providers';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  userType: string;
}

const FEEDBACK_CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: 'bug-report' },
  { id: 'feature', label: 'Feature Request', icon: 'lightbulb' },
  { id: 'ui', label: 'UI/UX Issue', icon: 'palette' },
  { id: 'performance', label: 'Performance', icon: 'speed' },
  { id: 'general', label: 'General Feedback', icon: 'chat' },
];

const USER_TYPES = [
  { id: 'first_time', label: 'First time user' },
  { id: 'casual', label: 'Casual user (1-2 times/week)' },
  { id: 'regular', label: 'Regular user (3-5 times/week)' },
  { id: 'power', label: 'Power user (daily)' },
];

export default function FeedbackModal({ visible, onClose, onSubmit }: FeedbackModalProps) {
  const { theme } = useTheme();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('');

  const handleSubmit = () => {
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

    // Reset form
    setRating(0);
    setCategory('');
    setMessage('');
    setUserType('');

    onClose();

    Alert.alert('Thank You!', 'Your feedback has been submitted.');
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxHeight: '80%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      marginTop: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    starButton: {
      marginHorizontal: 4,
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      margin: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedCategory: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryText: {
      marginLeft: 6,
      fontSize: 14,
      color: theme.colors.text,
    },
    selectedCategoryText: {
      color: '#FFFFFF',
    },
    userTypeContainer: {
      marginBottom: 16,
    },
    userTypeButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedUserType: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    userTypeText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    selectedUserTypeText: {
      color: '#FFFFFF',
    },
    messageInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    cancelButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Share Your Feedback</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Rating */}
            <Text style={styles.sectionTitle}>How would you rate FocusFit?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => setRating(star)}
                >
                  <MaterialIcons
                    name={star <= rating ? 'star' : 'star-border'}
                    size={32}
                    color={star <= rating ? '#FFD700' : theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Category */}
            <Text style={styles.sectionTitle}>What type of feedback is this?</Text>
            <View style={styles.categoryContainer}>
              {FEEDBACK_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryButton, category === cat.id && styles.selectedCategory]}
                  onPress={() => setCategory(cat.id)}
                >
                  <MaterialIcons
                    name={cat.icon as any}
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

            {/* User Type */}
            <Text style={styles.sectionTitle}>How often do you use FocusFit?</Text>
            <View style={styles.userTypeContainer}>
              {USER_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.userTypeButton, userType === type.id && styles.selectedUserType]}
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

            {/* Message */}
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
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
