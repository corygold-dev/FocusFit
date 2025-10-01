import analytics from '@react-native-firebase/analytics';

export class AnalyticsService {
  // ============================================================================
  // USER ACTIONS
  // ============================================================================

  static async trackFocusSessionStarted(duration: number) {
    await analytics().logEvent('focus_session_started', {
      duration_minutes: duration,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackFocusSessionCompleted(duration: number, actualDuration: number) {
    await analytics().logEvent('focus_session_completed', {
      planned_duration_minutes: duration,
      actual_duration_minutes: actualDuration,
      completion_rate: (actualDuration / duration) * 100,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackWorkoutStarted(exerciseCount: number, difficulty: string) {
    await analytics().logEvent('workout_started', {
      exercise_count: exerciseCount,
      difficulty,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackWorkoutCompleted(exerciseCount: number, duration: number, difficulty: string) {
    await analytics().logEvent('workout_completed', {
      exercise_count: exerciseCount,
      duration_minutes: Math.round(duration / 60),
      difficulty,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackExerciseCompleted(exerciseName: string, category: string) {
    await analytics().logEvent('exercise_completed', {
      exercise_name: exerciseName,
      category,
      timestamp: new Date().toISOString(),
    });
  }

  // ============================================================================
  // ACHIEVEMENTS
  // ============================================================================

  static async trackAchievementUnlocked(achievementId: string, achievementName: string) {
    await analytics().logEvent('achievement_unlocked', {
      achievement_id: achievementId,
      achievement_name: achievementName,
      timestamp: new Date().toISOString(),
    });
  }

  // ============================================================================
  // SETTINGS & PREFERENCES
  // ============================================================================

  static async trackSettingsChanged(settingType: string, oldValue: any, newValue: any) {
    await analytics().logEvent('settings_changed', {
      setting_type: settingType,
      old_value: oldValue,
      new_value: newValue,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackNotificationSettingsChanged(reminderType: string, enabled: boolean) {
    await analytics().logEvent('notification_settings_changed', {
      reminder_type: reminderType,
      enabled,
      timestamp: new Date().toISOString(),
    });
  }

  // ============================================================================
  // USER ENGAGEMENT
  // ============================================================================

  static async trackAppOpened() {
    await analytics().logEvent('app_opened', {
      timestamp: new Date().toISOString(),
    });
  }

  static async trackAnalyticsViewed() {
    await analytics().logEvent('analytics_viewed', {
      timestamp: new Date().toISOString(),
    });
  }

  static async trackDataExported(exportType: 'json' | 'csv') {
    await analytics().logEvent('data_exported', {
      export_type: exportType,
      timestamp: new Date().toISOString(),
    });
  }

  // ============================================================================
  // ONBOARDING & FIRST USE
  // ============================================================================

  static async trackOnboardingCompleted() {
    await analytics().logEvent('onboarding_completed', {
      timestamp: new Date().toISOString(),
    });
  }

  static async trackFirstFocusSession() {
    await analytics().logEvent('first_focus_session', {
      timestamp: new Date().toISOString(),
    });
  }

  static async trackFirstWorkout() {
    await analytics().logEvent('first_workout', {
      timestamp: new Date().toISOString(),
    });
  }

  // ============================================================================
  // USER PROPERTIES
  // ============================================================================

  static async setUserProperties(userId: string, properties: Record<string, any>) {
    await analytics().setUserId(userId);
    await analytics().setUserProperties(properties);
  }

  static async setUserEngagementLevel(level: 'new' | 'active' | 'power_user') {
    await analytics().setUserProperty('engagement_level', level);
  }

  static async setUserPreferredDifficulty(difficulty: string) {
    await analytics().setUserProperty('preferred_difficulty', difficulty);
  }

  static async setUserEquipment(equipment: string[]) {
    await analytics().setUserProperty('equipment', equipment.join(','));
  }
}

export const analyticsService = new AnalyticsService();
