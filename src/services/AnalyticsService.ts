// Simple Analytics Service for User Testing
export class AnalyticsService {
  // ============================================================================
  // USER ACTIONS
  // ============================================================================

  static trackFocusSessionStarted(duration: number) {
    console.log('📊 Analytics: Focus session started', { duration_minutes: duration });
    // TODO: Implement proper analytics when needed
  }

  static trackFocusSessionCompleted(duration: number, actualDuration: number) {
    console.log('📊 Analytics: Focus session completed', {
      planned_duration_minutes: duration,
      actual_duration_minutes: actualDuration,
      completion_rate: (actualDuration / duration) * 100,
    });
  }

  static trackWorkoutStarted(exerciseCount: number, difficulty: string) {
    console.log('📊 Analytics: Workout started', {
      exercise_count: exerciseCount,
      difficulty,
    });
  }

  static trackWorkoutCompleted(exerciseCount: number, duration: number, difficulty: string) {
    console.log('📊 Analytics: Workout completed', {
      exercise_count: exerciseCount,
      duration_minutes: Math.round(duration / 60),
      difficulty,
    });
  }

  static trackExerciseCompleted(exerciseName: string, category: string) {
    console.log('📊 Analytics: Exercise completed', {
      exercise_name: exerciseName,
      category,
    });
  }

  // ============================================================================
  // ACHIEVEMENTS
  // ============================================================================

  static trackAchievementUnlocked(achievementId: string, achievementName: string) {
    console.log('📊 Analytics: Achievement unlocked', {
      achievement_id: achievementId,
      achievement_name: achievementName,
    });
  }

  // ============================================================================
  // SETTINGS & PREFERENCES
  // ============================================================================

  static trackSettingsChanged(settingType: string, oldValue: unknown, newValue: unknown) {
    console.log('📊 Analytics: Settings changed', {
      setting_type: settingType,
      old_value: oldValue,
      new_value: newValue,
    });
  }

  static trackNotificationSettingsChanged(reminderType: string, enabled: boolean) {
    console.log('📊 Analytics: Notification settings changed', {
      reminder_type: reminderType,
      enabled,
    });
  }

  // ============================================================================
  // USER ENGAGEMENT
  // ============================================================================

  static trackAppOpened() {
    console.log('📊 Analytics: App opened');
  }

  static trackAnalyticsViewed() {
    console.log('📊 Analytics: Analytics viewed');
  }

  static trackDataExported(exportType: 'json' | 'csv') {
    console.log('📊 Analytics: Data exported', { export_type: exportType });
  }

  // ============================================================================
  // ONBOARDING & FIRST USE
  // ============================================================================

  static trackOnboardingCompleted() {
    console.log('📊 Analytics: Onboarding completed');
  }

  static trackFirstFocusSession() {
    console.log('📊 Analytics: First focus session');
  }

  static trackFirstWorkout() {
    console.log('📊 Analytics: First workout');
  }

  // ============================================================================
  // USER PROPERTIES
  // ============================================================================

  static setUserProperties(userId: string, properties: Record<string, unknown>) {
    console.log('📊 Analytics: User properties set', { userId, properties });
  }

  static setUserEngagementLevel(level: 'new' | 'active' | 'power_user') {
    console.log('📊 Analytics: User engagement level set', { level });
  }

  static setUserPreferredDifficulty(difficulty: string) {
    console.log('📊 Analytics: User preferred difficulty set', { difficulty });
  }

  static setUserEquipment(equipment: string[]) {
    console.log('📊 Analytics: User equipment set', { equipment });
  }
}

export const analyticsService = new AnalyticsService();
