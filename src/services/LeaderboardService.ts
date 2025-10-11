import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthUser } from './FirebaseAuthService';
import { FocusSession, WorkoutSession } from './FirebaseDataService';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  score: number;
  rank: number;
  avatar?: string;
  isCurrentUser: boolean;
}

interface UserData {
  username?: string;
  displayName?: string;
  avatar?: string;
}

export interface WeeklyLeaderboard {
  weekId: string;
  category: 'focus' | 'workouts';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export class LeaderboardService {
  private getCurrentWeekId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const weekNumber = this.getWeekNumber(now);
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  }

  private getWeekNumber(date: Date): number {
    // Simple week calculation: get the week number from the date
    const target = new Date(date.valueOf());

    // Get the first day of the year
    const yearStart = new Date(target.getFullYear(), 0, 1);

    // Calculate days since year start
    const diffTime = target.getTime() - yearStart.getTime();
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));

    // Calculate week number (simple approach)
    return Math.floor(diffDays / 7) + 1;
  }

  private getWeekDateRange(weekId: string): { start: Date; end: Date } {
    const [year, week] = weekId.split('-W');
    const yearNum = parseInt(year);
    const weekNum = parseInt(week);

    if (isNaN(yearNum) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
      throw new Error(`Invalid weekId format: ${weekId}`);
    }

    // Simple approach: calculate start and end based on week number
    const yearStart = new Date(yearNum, 0, 1);
    const start = new Date(yearStart);
    start.setDate(yearStart.getDate() + (weekNum - 1) * 7);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private async getUserDataBatch(
    userIds: string[]
  ): Promise<Map<string, UserData>> {
    const userDataMap = new Map<string, UserData>();

    const batchSize = 10;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      const promises = batch.map(userId =>
        getDoc(doc(db, 'users', userId)).then(doc => ({
          userId,
          data: doc.data(),
        }))
      );

      const results = await Promise.all(promises);
      results.forEach(({ userId, data }) => {
        if (data) {
          userDataMap.set(userId, data);
        }
      });
    }

    return userDataMap;
  }

  // Get focus leaderboard for current week
  async getFocusLeaderboard(user: AuthUser): Promise<LeaderboardEntry[]> {
    try {
      const weekId = this.getCurrentWeekId();
      const { start, end } = this.getWeekDateRange(weekId);

      // Get all focus sessions for this week
      const focusQuery = query(
        collection(db, 'focusSession'),
        where('completedAt', '>=', start),
        where('completedAt', '<=', end)
      );

      const focusSnapshot = await getDocs(focusQuery);
      const focusSessions: FocusSession[] = [];

      focusSnapshot.forEach(doc => {
        const data = doc.data();
        focusSessions.push({
          userId: data.userId,
          sessionId: data.sessionId,
          duration: data.duration,
          completedAt: data.completedAt?.toDate() || new Date(),
        });
      });

      const userTotals = new Map<string, number>();
      focusSessions.forEach(session => {
        const current = userTotals.get(session.userId) || 0;
        userTotals.set(session.userId, current + session.duration);
      });

      const userIds = Array.from(userTotals.keys());
      const userDataMap = await this.getUserDataBatch(userIds);

      const entries: LeaderboardEntry[] = [];
      for (const [userId, totalMinutes] of userTotals) {
        const userData = userDataMap.get(userId);

        entries.push({
          userId,
          username: userData?.username || 'Anonymous',
          displayName: userData?.displayName || 'Anonymous User',
          score: totalMinutes,
          rank: 0, // Will be set after sorting
          avatar: userData?.avatar,
          isCurrentUser: userId === user.uid,
        });
      }

      entries.sort((a, b) => b.score - a.score);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      return entries;
    } catch (error) {
      console.error('Error getting focus leaderboard:', error);
      return [];
    }
  }

  async getWorkoutsLeaderboard(user: AuthUser): Promise<LeaderboardEntry[]> {
    try {
      const weekId = this.getCurrentWeekId();
      const { start, end } = this.getWeekDateRange(weekId);

      const workoutQuery = query(
        collection(db, 'workoutSession'),
        where('completedAt', '>=', start),
        where('completedAt', '<=', end)
      );

      const workoutSnapshot = await getDocs(workoutQuery);
      const workoutSessions: WorkoutSession[] = [];

      workoutSnapshot.forEach(doc => {
        const data = doc.data();
        workoutSessions.push({
          userId: data.userId,
          sessionId: data.sessionId || doc.id,
          exercises: data.exercises,
          duration: data.duration,
          completedAt: data.completedAt?.toDate() || new Date(),
        });
      });

      const userCounts = new Map<string, number>();
      workoutSessions.forEach(session => {
        const current = userCounts.get(session.userId) || 0;
        userCounts.set(session.userId, current + 1);
      });

      const userIds = Array.from(userCounts.keys());
      const userDataMap = await this.getUserDataBatch(userIds);

      const entries: LeaderboardEntry[] = [];
      for (const [userId, workoutCount] of userCounts) {
        const userData = userDataMap.get(userId);

        entries.push({
          userId,
          username: userData?.username || 'Anonymous',
          displayName: userData?.displayName || 'Anonymous User',
          score: workoutCount,
          rank: 0, // Will be set after sorting
          avatar: userData?.avatar,
          isCurrentUser: userId === user.uid,
        });
      }

      entries.sort((a, b) => b.score - a.score);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      return entries;
    } catch (error) {
      console.error('Error getting workouts leaderboard:', error);
      return [];
    }
  }

  async getUserRank(
    user: AuthUser,
    category: 'focus' | 'workouts'
  ): Promise<number> {
    try {
      const weekId = this.getCurrentWeekId();
      const { start, end } = this.getWeekDateRange(weekId);

      const collectionName =
        category === 'focus' ? 'focusSession' : 'workoutSession';

      const userQuery = query(
        collection(db, collectionName),
        where('userId', '==', user.uid),
        where('completedAt', '>=', start),
        where('completedAt', '<=', end)
      );

      const userSnapshot = await getDocs(userQuery);
      let userScore = 0;

      if (category === 'focus') {
        userScore = userSnapshot.docs.reduce((total, doc) => {
          return total + (doc.data().duration || 0);
        }, 0);
      } else {
        userScore = userSnapshot.docs.length;
      }

      if (userScore === 0) return 0;

      const allSessionsQuery = query(
        collection(db, collectionName),
        where('completedAt', '>=', start),
        where('completedAt', '<=', end)
      );

      const allSessionsSnapshot = await getDocs(allSessionsQuery);
      const userScores = new Map<string, number>();

      allSessionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const userId = data.userId;

        if (category === 'focus') {
          const duration = data.duration || 0;
          const current = userScores.get(userId) || 0;
          userScores.set(userId, current + duration);
        } else {
          const current = userScores.get(userId) || 0;
          userScores.set(userId, current + 1);
        }
      });

      let rank = 1;
      for (const [, score] of userScores) {
        if (score > userScore) rank++;
      }

      return rank;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return 0;
    }
  }
}

export const leaderboardService = new LeaderboardService();
