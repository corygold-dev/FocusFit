import packageJson from '../../package.json';
import { AuthUser } from './FirebaseAuthService';
import {
  firebaseDataService,
  FocusSession,
  UserProgress,
  UserSettings,
  WorkoutSession,
} from './FirebaseDataService';
import { simpleOfflineService } from './SimpleOfflineService';

export interface ExportData {
  user: {
    uid: string;
    email: string;
    displayName: string | null;
    exportDate: string;
    appVersion: string;
  };
  settings: UserSettings | null;
  progress: UserProgress | null;
  focusSessions: FocusSession[];
  workoutSessions: WorkoutSession[];
  offlineData: {
    pendingSessions: {
      focus: FocusSession[];
      workout: WorkoutSession[];
    };
    pendingProgress: UserProgress[];
    pendingSettings: UserSettings[];
  };
  metadata: {
    totalFocusTime: number;
    totalWorkoutTime: number;
    totalSessions: number;
    currentStreaks: {
      focus: number;
      workout: number;
    };
  };
}

export class DataExportService {
  // ============================================================================
  // EXPORT METHODS
  // ============================================================================

  async exportAllData(user: AuthUser): Promise<ExportData> {
    try {
      console.log('📊 Starting data export...');

      // Get all user data
      const [
        settings,
        progress,
        focusSessions,
        workoutSessions,
        totalFocusTime,
        totalWorkoutTime,
        offlineData,
      ] = await Promise.all([
        firebaseDataService.getUserSettings(user),
        firebaseDataService.getUserProgress(user),
        firebaseDataService.getUserFocusHistory(user),
        firebaseDataService.getUserWorkoutHistory(user),
        firebaseDataService.getTotalFocusDuration(user),
        firebaseDataService.getTotalWorkoutDuration(user),
        this.getOfflineData(),
      ]);

      // Calculate metadata
      const totalSessions = focusSessions.length + workoutSessions.length;
      const currentStreaks = {
        focus: progress?.focusStreak || 0,
        workout: progress?.workoutStreak || 0,
      };

      const exportData: ExportData = {
        user: {
          uid: user.uid,
          email: user.email || 'Unknown',
          displayName: user.displayName || 'Unknown',
          exportDate: new Date().toISOString(),
          appVersion: packageJson.version,
        },
        settings,
        progress,
        focusSessions,
        workoutSessions,
        offlineData,
        metadata: {
          totalFocusTime,
          totalWorkoutTime,
          totalSessions,
          currentStreaks,
        },
      };

      console.log('✅ Data export completed');
      return exportData;
    } catch (error) {
      console.error('❌ Data export failed:', error);
      throw error;
    }
  }

  async exportToJSON(user: AuthUser): Promise<string> {
    const data = await this.exportAllData(user);
    return JSON.stringify(data, null, 2);
  }

  async exportToCSV(user: AuthUser): Promise<string> {
    const data = await this.exportAllData(user);

    let csv = 'Type,Date,Duration,Details\n';

    // Add focus sessions
    data.focusSessions.forEach((session) => {
      const date = new Date(session.completedAt).toLocaleDateString();
      const duration = Math.round(session.duration / 60); // Convert to minutes
      csv += `Focus Session,${date},${duration} minutes,Focus session\n`;
    });

    // Add workout sessions
    data.workoutSessions.forEach((session) => {
      const date = session.completedAt
        ? new Date(session.completedAt).toLocaleDateString()
        : 'Unknown';
      const duration = session.duration ? Math.round(session.duration / 60) : 0; // Convert to minutes
      const exercises = session.exercises.join(', ');
      csv += `Workout,${date},${duration} minutes,${exercises}\n`;
    });

    return csv;
  }

  // ============================================================================
  // OFFLINE DATA EXPORT
  // ============================================================================

  private async getOfflineData() {
    try {
      const [sessions, progress, settings] = await Promise.all([
        simpleOfflineService.getOfflineSessions(),
        simpleOfflineService.getOfflineProgress(),
        simpleOfflineService.getOfflineSettings(),
      ]);

      return {
        pendingSessions: sessions,
        pendingProgress: progress,
        pendingSettings: settings,
      };
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return {
        pendingSessions: { focus: [], workout: [] },
        pendingProgress: [],
        pendingSettings: [],
      };
    }
  }

  // ============================================================================
  // SUMMARY GENERATION
  // ============================================================================

  async generateSummary(user: AuthUser): Promise<string> {
    const data = await this.exportAllData(user);

    const summary = `
# FocusFit Data Export Summary

## User Information
- **User ID:** ${data.user.uid}
- **Email:** ${data.user.email}
- **Export Date:** ${new Date(data.user.exportDate).toLocaleString()}

## Statistics
- **Total Focus Sessions:** ${data.focusSessions.length}
- **Total Workout Sessions:** ${data.workoutSessions.length}
- **Total Focus Time:** ${Math.round(data.metadata.totalFocusTime / 3600)} hours
- **Total Workout Time:** ${Math.round(data.metadata.totalWorkoutTime / 3600)} hours
- **Current Focus Streak:** ${data.metadata.currentStreaks.focus} days
- **Current Workout Streak:** ${data.metadata.currentStreaks.workout} days

## Recent Activity (Last 7 Days)
${this.getRecentActivitySummary(data)}

## Offline Data
- **Pending Focus Sessions:** ${data.offlineData.pendingSessions.focus.length}
- **Pending Workout Sessions:** ${data.offlineData.pendingSessions.workout.length}
- **Pending Progress Updates:** ${data.offlineData.pendingProgress.length}
- **Pending Settings Updates:** ${data.offlineData.pendingSettings.length}

---
*This data was exported from FocusFit on ${new Date().toLocaleString()}*
    `.trim();

    return summary;
  }

  private getRecentActivitySummary(data: ExportData): string {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentFocus = data.focusSessions.filter(
      (session) => new Date(session.completedAt) >= sevenDaysAgo,
    );

    const recentWorkouts = data.workoutSessions.filter(
      (session) => session.completedAt && new Date(session.completedAt) >= sevenDaysAgo,
    );

    const totalRecentTime =
      recentFocus.reduce((sum, session) => sum + session.duration, 0) +
      recentWorkouts.reduce((sum, session) => sum + (session.duration || 0), 0);

    return `
- **Focus Sessions:** ${recentFocus.length}
- **Workout Sessions:** ${recentWorkouts.length}
- **Total Time:** ${Math.round(totalRecentTime / 3600)} hours
    `.trim();
  }

  // ============================================================================
  // DATA VALIDATION
  // ============================================================================

  async validateExportData(data: ExportData): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Check required fields
    if (!data.user.uid) errors.push('Missing user ID');
    if (!data.user.email) errors.push('Missing user email');
    if (!data.user.exportDate) errors.push('Missing export date');

    // Check data consistency
    if (data.focusSessions.length < 0) errors.push('Invalid focus sessions count');
    if (data.workoutSessions.length < 0) errors.push('Invalid workout sessions count');

    // Check for reasonable data ranges
    if (data.metadata.totalFocusTime < 0) errors.push('Invalid total focus time');
    if (data.metadata.totalWorkoutTime < 0) errors.push('Invalid total workout time');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const dataExportService = new DataExportService();
