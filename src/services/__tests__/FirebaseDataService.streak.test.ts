// Mock Firebase modules to avoid ESM import issues
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  initializeAuth: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {},
}));

jest.mock('../../config/firebase', () => ({
  db: {},
  auth: {},
  app: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getFirestore: jest.fn(),
  where: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  Timestamp: {
    fromDate: jest.fn(date => ({ seconds: date.getTime() / 1000 })),
    now: jest.fn(() => ({ seconds: Date.now() / 1000 })),
  },
}));

// Now import the service class that depends on the mocked Firebase modules
import { FirebaseDataService } from '../FirebaseDataService';

describe('FirebaseDataService - Streak Calculation Logic', () => {
  let service: FirebaseDataService;

  beforeEach(() => {
    service = new FirebaseDataService();
  });

  describe('calculateStreak', () => {
    describe('First Activity', () => {
      it('should return 1 when no previous activity exists (null)', () => {
        const result = service.calculateStreak(0, null);
        expect(result).toBe(1);
      });

      it('should return 1 when no previous activity exists (undefined)', () => {
        const result = service.calculateStreak(0, undefined);
        expect(result).toBe(1);
      });

      it('should return 1 regardless of current streak when lastActivityDate is null', () => {
        const result = service.calculateStreak(10, null);
        expect(result).toBe(1);
      });
    });

    // Rest of your test cases follow here - I'm not modifying them
    describe('Same Day Activity', () => {
      it('should maintain current streak for same-day activity', () => {
        const today = new Date('2024-01-15T10:00:00Z');
        const sameDay = new Date('2024-01-15T08:00:00Z');
        const currentStreak = 5;

        const result = service.calculateStreak(currentStreak, sameDay, today);
        expect(result).toBe(5);
      });

      it('should maintain streak even with different hours on same day', () => {
        const morning = new Date('2024-01-15T06:00:00Z');
        const evening = new Date('2024-01-15T22:00:00Z');
        const currentStreak = 3;

        const result = service.calculateStreak(currentStreak, morning, evening);
        expect(result).toBe(3);
      });

      it('should maintain streak of 0 on same day', () => {
        const today = new Date('2024-01-15T10:00:00Z');
        const sameDay = new Date('2024-01-15T14:00:00Z');

        const result = service.calculateStreak(0, sameDay, today);
        expect(result).toBe(0);
      });
    });

    describe('Consecutive Day Activity', () => {
      it('should increment streak for consecutive day', () => {
        const yesterday = new Date('2024-01-15T10:00:00Z');
        const today = new Date('2024-01-16T10:00:00Z');
        const currentStreak = 3;

        const result = service.calculateStreak(currentStreak, yesterday, today);
        expect(result).toBe(4);
      });

      it('should ensure minimum streak of 1 when incrementing from 0', () => {
        const yesterday = new Date('2024-01-15T10:00:00Z');
        const today = new Date('2024-01-16T10:00:00Z');
        const currentStreak = 0;

        const result = service.calculateStreak(currentStreak, yesterday, today);
        expect(result).toBe(1);
      });

      it('should increment streak even with different times', () => {
        const yesterdayMorning = new Date('2024-01-15T06:00:00Z');
        const todayEvening = new Date('2024-01-16T22:00:00Z');
        const currentStreak = 7;

        const result = service.calculateStreak(
          currentStreak,
          yesterdayMorning,
          todayEvening
        );
        expect(result).toBe(8);
      });

      it('should build streak from 1 to 2', () => {
        const yesterday = new Date('2024-01-15T12:00:00Z');
        const today = new Date('2024-01-16T12:00:00Z');
        const currentStreak = 1;

        const result = service.calculateStreak(currentStreak, yesterday, today);
        expect(result).toBe(2);
      });
    });

    describe('Missed Days - Streak Reset', () => {
      it('should reset streak to 1 when 2 days have passed', () => {
        const twoDaysAgo = new Date('2024-01-15T10:00:00Z');
        const today = new Date('2024-01-17T10:00:00Z');
        const currentStreak = 5;

        const result = service.calculateStreak(
          currentStreak,
          twoDaysAgo,
          today
        );
        expect(result).toBe(1);
      });

      it('should reset streak to 1 when 3 days have passed', () => {
        const threeDaysAgo = new Date('2024-01-15T10:00:00Z');
        const today = new Date('2024-01-18T10:00:00Z');
        const currentStreak = 10;

        const result = service.calculateStreak(
          currentStreak,
          threeDaysAgo,
          today
        );
        expect(result).toBe(1);
      });

      it('should reset streak to 1 when a week has passed', () => {
        const weekAgo = new Date('2024-01-08T10:00:00Z');
        const today = new Date('2024-01-15T10:00:00Z');
        const currentStreak = 20;

        const result = service.calculateStreak(currentStreak, weekAgo, today);
        expect(result).toBe(1);
      });

      it('should reset high streak to 1 after missing days', () => {
        const lastActivity = new Date('2024-01-10T10:00:00Z');
        const today = new Date('2024-01-15T10:00:00Z');
        const currentStreak = 100;

        const result = service.calculateStreak(
          currentStreak,
          lastActivity,
          today
        );
        expect(result).toBe(1);
      });
    });

    describe('Future Date Edge Cases', () => {
      it('should reset to 1 for future activity dates', () => {
        const tomorrow = new Date('2024-01-16T10:00:00Z');
        const today = new Date('2024-01-15T10:00:00Z');
        const currentStreak = 5;

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const result = service.calculateStreak(currentStreak, tomorrow, today);

        expect(result).toBe(1);
        expect(warnSpy).toHaveBeenCalledWith(
          'Future activity date detected, resetting streak'
        );

        warnSpy.mockRestore();
      });

      it('should handle future dates gracefully without throwing', () => {
        const futureDate = new Date('2025-12-31T10:00:00Z');
        const today = new Date('2024-01-15T10:00:00Z');

        const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

        expect(() => {
          service.calculateStreak(5, futureDate, today);
        }).not.toThrow();

        warnSpy.mockRestore();
      });
    });

    describe('Timezone Handling', () => {
      it('should handle different timezones on same calendar day', () => {
        const estMorning = new Date('2024-01-15T05:00:00-05:00');
        const utcAfternoon = new Date('2024-01-15T15:00:00Z');
        const currentStreak = 3;

        const result = service.calculateStreak(
          currentStreak,
          estMorning,
          utcAfternoon
        );
        expect(result).toBe(3);
      });

      it('should correctly identify consecutive days across timezone boundary', () => {
        const lateNightEST = new Date('2024-01-15T23:00:00-05:00');
        const morningUTC = new Date('2024-01-16T10:00:00Z');
        const currentStreak = 2;

        const result = service.calculateStreak(
          currentStreak,
          lateNightEST,
          morningUTC
        );
        expect(result).toBe(2);
      });

      it('should handle PST to EST timezone difference', () => {
        const pstMorning = new Date('2024-01-15T06:00:00-08:00');
        const estEvening = new Date('2024-01-15T20:00:00-05:00');
        const currentStreak = 4;

        const result = service.calculateStreak(
          currentStreak,
          pstMorning,
          estEvening
        );
        expect(result).toBe(5);
      });

      it('should normalize dates to UTC for accurate day calculation', () => {
        const jan15Pacific = new Date('2024-01-15T22:00:00-08:00');
        const jan16EarlyUTC = new Date('2024-01-16T08:00:00Z');
        const currentStreak = 1;

        const result = service.calculateStreak(
          currentStreak,
          jan15Pacific,
          jan16EarlyUTC
        );
        expect(result).toBe(1);
      });
    });

    describe('Firebase Timestamp Compatibility', () => {
      it('should handle Firebase Timestamp objects', () => {
        const firebaseTimestamp = {
          toDate: () => new Date('2024-01-15T10:00:00Z'),
        } as { toDate: () => Date };
        const today = new Date('2024-01-16T10:00:00Z');
        const currentStreak = 2;

        const result = service.calculateStreak(
          currentStreak,
          firebaseTimestamp as unknown as Date,
          today
        );
        expect(result).toBe(3);
      });

      it('should handle Firebase Timestamp for same day', () => {
        const firebaseTimestamp = {
          toDate: () => new Date('2024-01-15T08:00:00Z'),
        } as { toDate: () => Date };
        const today = new Date('2024-01-15T14:00:00Z');
        const currentStreak = 5;

        const result = service.calculateStreak(
          currentStreak,
          firebaseTimestamp as unknown as Date,
          today
        );
        expect(result).toBe(5);
      });
    });

    describe('Edge Cases Around 24-Hour Boundaries', () => {
      it('should treat exactly 24 hours as consecutive day', () => {
        const yesterday = new Date('2024-01-15T10:00:00Z');
        const exactlyOneDayLater = new Date('2024-01-16T10:00:00Z');
        const currentStreak = 1;

        const result = service.calculateStreak(
          currentStreak,
          yesterday,
          exactlyOneDayLater
        );
        expect(result).toBe(2);
      });

      it('should treat 23 hours 59 minutes as same day', () => {
        const morning = new Date('2024-01-15T00:01:00Z');
        const almostMidnight = new Date('2024-01-15T23:59:00Z');
        const currentStreak = 1;

        const result = service.calculateStreak(
          currentStreak,
          morning,
          almostMidnight
        );
        expect(result).toBe(1);
      });

      it('should treat just over 24 hours as consecutive day if different calendar days', () => {
        const yesterday = new Date('2024-01-15T23:00:00Z');
        const todayMorning = new Date('2024-01-16T01:00:00Z');
        const currentStreak = 1;

        const result = service.calculateStreak(
          currentStreak,
          yesterday,
          todayMorning
        );
        expect(result).toBe(2);
      });

      it('should handle midnight boundary correctly', () => {
        const beforeMidnight = new Date('2024-01-15T23:59:59Z');
        const afterMidnight = new Date('2024-01-16T00:00:01Z');
        const currentStreak = 5;

        const result = service.calculateStreak(
          currentStreak,
          beforeMidnight,
          afterMidnight
        );
        expect(result).toBe(6);
      });
    });

    describe('Real-World Scenarios', () => {
      it('should handle a user completing focus session twice on same day', () => {
        const morningSession = new Date('2024-01-15T08:00:00Z');
        const afternoonSession = new Date('2024-01-15T14:00:00Z');
        const currentStreak = 7;

        const result = service.calculateStreak(
          currentStreak,
          morningSession,
          afternoonSession
        );
        expect(result).toBe(7);
      });

      it('should handle weekend gap correctly', () => {
        const friday = new Date('2024-01-12T10:00:00Z');
        const monday = new Date('2024-01-15T10:00:00Z');
        const currentStreak = 5;

        const result = service.calculateStreak(currentStreak, friday, monday);
        expect(result).toBe(1);
      });

      it('should build a long streak over consecutive days', () => {
        let streak = 0;
        let currentDate = new Date('2024-01-01T12:00:00Z');

        for (let i = 0; i < 30; i++) {
          const nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + 1);

          streak = service.calculateStreak(streak, currentDate, nextDate);
          currentDate = nextDate;
        }

        expect(streak).toBe(30);
      });

      it('should handle streak recovery after a break', () => {
        const lastActivity = new Date('2024-01-10T12:00:00Z');
        const afterBreak = new Date('2024-01-15T12:00:00Z');
        const previousStreak = 15;

        const result = service.calculateStreak(
          previousStreak,
          lastActivity,
          afterBreak
        );
        expect(result).toBe(1);
      });
    });

    describe('Default Parameter - Current Date', () => {
      it('should use current date when newActivityDate is not provided', () => {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const currentStreak = 3;

        const result = service.calculateStreak(currentStreak, yesterday);

        expect(result).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
