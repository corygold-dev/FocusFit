import { useAuth, useTheme } from '@/src/providers';
import { getAchievementById } from '@/src/utils/achievements';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, View } from 'react-native';
import { analyticsModalStyles } from './styles/analyticsModal.styles';

interface AnalyticsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  totalWorkouts: number;
  totalFocusSessions: number;
  totalWorkoutTime: number;
  totalFocusTime: number;
  currentWorkoutStreak: number;
  currentFocusStreak: number;
  longestWorkoutStreak: number;
  longestFocusStreak: number;
  averageFocusDuration: number;
  thisWeekWorkouts: number;
  thisWeekFocusSessions: number;
  lastWorkoutDate: Date | null;
  lastFocusDate: Date | null;
  achievements: string[];
}

export default function AnalyticsModal({ visible, onClose }: AnalyticsModalProps) {
  const { theme } = useTheme();
  const {
    user,
    getUserProgress,
    getUserWorkoutHistory,
    getUserFocusHistory,
    getTotalWorkouts,
    getTotalFocusSessions,
    getTotalWorkoutDuration,
    getTotalFocusDuration,
  } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const styles = analyticsModalStyles(theme);

  const loadAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);

      const progress = await getUserProgress();
      if (!progress) return;

      const [
        totalWorkouts,
        totalFocusSessions,
        totalWorkoutDuration,
        totalFocusDuration,
        workoutHistory,
        focusHistory,
      ] = await Promise.all([
        getTotalWorkouts(),
        getTotalFocusSessions(),
        getTotalWorkoutDuration(),
        getTotalFocusDuration(),
        getUserWorkoutHistory(),
        getUserFocusHistory(),
      ]);

      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);

      const thisWeekWorkouts = workoutHistory.filter(
        (session) => session.completedAt && new Date(session.completedAt) >= thisWeek,
      ).length;

      const thisWeekFocusSessions = focusHistory.filter(
        (session) => session.completedAt && new Date(session.completedAt) >= thisWeek,
      ).length;

      const averageFocusDuration =
        focusHistory.length > 0
          ? focusHistory.reduce((sum, session) => sum + session.duration, 0) /
            focusHistory.length /
            60
          : 0;

      setAnalyticsData({
        totalWorkouts,
        totalFocusSessions,
        totalWorkoutTime: Math.round(totalWorkoutDuration / 60),
        totalFocusTime: Math.round(totalFocusDuration / 60),
        currentWorkoutStreak: progress.workoutStreak,
        currentFocusStreak: progress.focusStreak,
        longestWorkoutStreak: progress.workoutStreak,
        longestFocusStreak: progress.focusStreak,
        averageFocusDuration: Math.round(averageFocusDuration),
        thisWeekWorkouts,
        thisWeekFocusSessions,
        lastWorkoutDate: progress.lastWorkoutDate ? new Date(progress.lastWorkoutDate) : null,
        lastFocusDate: progress.lastFocusSessionDate
          ? new Date(progress.lastFocusSessionDate)
          : null,
        achievements: progress.achievements || [],
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    getUserProgress,
    getTotalWorkouts,
    getTotalFocusSessions,
    getTotalWorkoutDuration,
    getTotalFocusDuration,
    getUserWorkoutHistory,
    getUserFocusHistory,
  ]);

  useEffect(() => {
    if (visible && user) {
      loadAnalyticsData();
    }
  }, [visible, user, loadAnalyticsData]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading analytics...</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.titleContainer}>
                <MaterialIcons name="analytics" size={28} color={theme.colors.primary} />
                <Text style={styles.modalTitle}>Your Progress</Text>
              </View>

              <View style={styles.focusSection}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="psychology" size={20} color="#2196F3" />
                  <Text style={styles.sectionTitle}>Focus Sessions</Text>
                </View>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>
                      {analyticsData?.totalFocusSessions || 0}
                    </Text>
                    <Text style={styles.metricLabel}>Total Sessions</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>
                      {formatDuration(analyticsData?.totalFocusTime || 0)}
                    </Text>
                    <Text style={styles.metricLabel}>Total Time</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>
                      {analyticsData?.averageFocusDuration || 0}m
                    </Text>
                    <Text style={styles.metricLabel}>Avg Duration</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>
                      {analyticsData?.currentFocusStreak || 0}
                    </Text>
                    <Text style={styles.metricLabel}>Focus Streak</Text>
                  </View>
                </View>
              </View>

              <View style={styles.workoutSection}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="fitness-center" size={20} color="#FF9800" />
                  <Text style={styles.sectionTitle}>Workouts</Text>
                </View>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>{analyticsData?.totalWorkouts || 0}</Text>
                    <Text style={styles.metricLabel}>Total Workouts</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>
                      {formatDuration(analyticsData?.totalWorkoutTime || 0)}
                    </Text>
                    <Text style={styles.metricLabel}>Total Time</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>{analyticsData?.thisWeekWorkouts || 0}</Text>
                    <Text style={styles.metricLabel}>This Week</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNumber}>
                      {analyticsData?.currentWorkoutStreak || 0}
                    </Text>
                    <Text style={styles.metricLabel}>Workout Streak</Text>
                  </View>
                </View>
              </View>

              {/* Achievements Section */}
              <View style={styles.achievementsSection}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="emoji-events" size={20} color="#FFD700" />
                  <Text style={styles.sectionTitle}>Achievements</Text>
                </View>
                {analyticsData?.achievements && analyticsData.achievements.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.achievementsCarousel}
                  >
                    {analyticsData.achievements.map((achievementId, index) => {
                      const achievement = getAchievementById(achievementId);
                      return (
                        <View key={index} style={styles.achievementCard}>
                          <View style={styles.achievementIcon}>
                            <MaterialIcons
                              name={
                                (achievement?.iconName as keyof typeof MaterialIcons.glyphMap) ||
                                'emoji-events'
                              }
                              size={24}
                              color={achievement?.iconColor || '#4CAF50'}
                            />
                          </View>
                          <Text style={styles.achievementText}>
                            {achievement?.name || achievementId}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View style={styles.noAchievementsContainer}>
                    <Text style={styles.noAchievementsText}>
                      Keep going to unlock achievements!
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          <View style={styles.buttonRow}>
            <Text style={styles.closeButton} onPress={onClose}>
              Close
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
