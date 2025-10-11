import { useAuth } from '@/src/providers';
import {
  LeaderboardEntry,
  leaderboardService,
} from '@/src/services/LeaderboardService';
import { useCallback, useEffect, useState } from 'react';

export type LeaderboardCategory = 'focus' | 'workouts';

interface UseLeaderboardReturn {
  focusEntries: LeaderboardEntry[];
  workoutsEntries: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  refreshLeaderboards: () => Promise<void>;
  getUserRank: (category: LeaderboardCategory) => number;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const { user } = useAuth();
  const [focusEntries, setFocusEntries] = useState<LeaderboardEntry[]>([]);
  const [workoutsEntries, setWorkoutsEntries] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboards = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [focusData, workoutsData] = await Promise.all([
        leaderboardService.getFocusLeaderboard(user),
        leaderboardService.getWorkoutsLeaderboard(user),
      ]);

      setFocusEntries(focusData);
      setWorkoutsEntries(workoutsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load leaderboards';
      setError(errorMessage);
      console.error('Error loading leaderboards:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshLeaderboards = useCallback(async () => {
    await loadLeaderboards();
  }, [loadLeaderboards]);

  const getUserRank = useCallback(
    (category: LeaderboardCategory): number => {
      const entries = category === 'focus' ? focusEntries : workoutsEntries;
      const userEntry = entries.find(entry => entry.isCurrentUser);
      return userEntry?.rank || 0;
    },
    [focusEntries, workoutsEntries]
  );

  useEffect(() => {
    loadLeaderboards();
  }, [loadLeaderboards]);

  return {
    focusEntries,
    workoutsEntries,
    isLoading,
    error,
    refreshLeaderboards,
    getUserRank,
  };
}
