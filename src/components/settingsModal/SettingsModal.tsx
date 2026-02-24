import { useAuth, useTheme } from '@/src/providers';
import { DIFFICULTY_LEVELS, EQUIPMENT_OPTIONS } from '@/src/utils/constants';
import { UserSettings } from '@/src/utils/exerciseUtils';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FeedbackData, feedbackService } from '../../services/FeedbackService';
import FeedbackModal from '../FeedbackModal';
import DataExportSection from './DataExportSection';
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
  initialMorningReminders?: boolean;
  initialAfternoonReminders?: boolean;
  initialTimerEndNotifications?: boolean;
  onSave: (settings: UserSettings) => void;
}

export default function SettingsModal({
  visible,
  onClose,
  initialEquipment,
  initialDifficulty,
  initialExcludedExercises = [],
  initialMorningReminders = true,
  initialAfternoonReminders = true,
  initialTimerEndNotifications = true,
  onSave,
}: SettingsModalProps) {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { logout, deleteAccount, user } = useAuth();
  const router = useRouter();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const styles = settingsModalStyles(theme);

  const [equipment, setEquipment] = useState<string[]>(initialEquipment);
  const [difficulty, setDifficulty] =
    useState<UserSettings['difficulty']>(initialDifficulty);
  const [excludedExercises, setExcludedExercises] = useState<string[]>(
    initialExcludedExercises
  );
  const [notifications, setNotifications] = useState({
    morningReminders: initialMorningReminders,
    afternoonReminders: initialAfternoonReminders,
    timerEndNotifications: initialTimerEndNotifications,
  });

  useEffect(() => {
    if (visible) {
      setEquipment(initialEquipment);
      setDifficulty(initialDifficulty);
      setExcludedExercises(initialExcludedExercises);
      setNotifications({
        morningReminders: initialMorningReminders,
        afternoonReminders: initialAfternoonReminders,
        timerEndNotifications: initialTimerEndNotifications,
      });
    }
  }, [
    visible,
    initialEquipment,
    initialDifficulty,
    initialExcludedExercises,
    initialMorningReminders,
    initialAfternoonReminders,
    initialTimerEndNotifications,
  ]);

  const handleSave = () => {
    onSave({
      equipment,
      difficulty,
      excludedExercises,
      theme: themeMode,
      ...notifications,
    });
    onClose();
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        await logout();
        router.replace('/sign-in');
      }
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/sign-in');
          },
        },
      ]);
    }
  };

  const performDeleteAccount = async (password?: string) => {
    try {
      setIsDeletingAccount(true);
      await deleteAccount(password);
      setShowReauthModal(false);
      Alert.alert(
        'Account Deleted',
        'Your account and all associated data have been permanently deleted.',
        [{ text: 'OK' }]
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to delete account. Please try again.';
      if (message === 'REQUIRES_RECENT_LOGIN') {
        // Need reauthentication — show password prompt
        if (Platform.OS === 'ios') {
          Alert.prompt(
            'Confirm Your Password',
            'For security, please enter your password to delete your account.',
            async pwd => {
              if (pwd) {
                await performDeleteAccount(pwd);
              }
            },
            'secure-text'
          );
        } else {
          setReauthPassword('');
          setReauthError(null);
          setShowReauthModal(true);
        }
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete your account and all data. Are you absolutely sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete',
                  style: 'destructive',
                  onPress: () => performDeleteAccount(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleFeedbackSubmit = async (feedback: FeedbackData) => {
    if (!user) return;

    try {
      await feedbackService.submitFeedback(user, feedback);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
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
              <ThemeSelector
                currentTheme={themeMode}
                onThemeChange={setThemeMode}
              />

              <Text style={styles.sectionTitle}>Daily Reminders:</Text>
              <NotificationSettings
                initialMorningReminders={notifications.morningReminders}
                initialAfternoonReminders={notifications.afternoonReminders}
                initialTimerEndNotifications={
                  notifications.timerEndNotifications
                }
                onNotificationChange={setNotifications}
              />

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
                <DataExportSection />

                <TouchableOpacity
                  style={styles.feedbackButton}
                  onPress={() => setShowFeedbackModal(true)}
                >
                  <Text style={styles.feedbackButtonText}>Send Feedback</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.supportButton}
                  onPress={() =>
                    Linking.openURL('https://buymeacoffee.com/corygold')
                  }
                >
                  <Text style={styles.supportButtonText}>
                    ☕ Buy Me a Coffee
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteAccountButton}
                  onPress={handleDeleteAccount}
                >
                  <Text style={styles.deleteAccountText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={onClose}
              color={theme.colors.textSecondary}
            />
            <Button
              title="Save"
              onPress={handleSave}
              color={theme.colors.primary}
            />
          </View>
        </View>
      </View>

      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />

      <Modal visible={showReauthModal} transparent animationType="fade">
        <View style={styles.reauthOverlay}>
          <View style={styles.reauthDialog}>
            <Text style={styles.reauthTitle}>Confirm Your Password</Text>
            <Text style={styles.reauthMessage}>
              For security, please enter your password to delete your account.
            </Text>
            <TextInput
              style={styles.reauthInput}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={reauthPassword}
              onChangeText={text => {
                setReauthPassword(text);
                setReauthError(null);
              }}
              autoFocus
            />
            {reauthError ? (
              <Text style={styles.reauthErrorText}>{reauthError}</Text>
            ) : null}
            <View style={styles.reauthButtonRow}>
              <TouchableOpacity
                style={styles.reauthCancelButton}
                onPress={() => setShowReauthModal(false)}
              >
                <Text style={styles.reauthCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reauthDeleteButton}
                onPress={async () => {
                  if (!reauthPassword) {
                    setReauthError('Please enter your password.');
                    return;
                  }
                  setReauthError(null);
                  await performDeleteAccount(reauthPassword);
                }}
                disabled={isDeletingAccount}
              >
                <Text style={styles.reauthDeleteButtonText}>
                  {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
