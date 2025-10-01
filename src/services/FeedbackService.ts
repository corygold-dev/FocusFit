import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthUser } from './index';

export interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  userType: string;
}

export interface FeedbackSubmission extends FeedbackData {
  userId: string;
  userEmail: string | null;
  timestamp: unknown;
  appVersion: string;
  platform: string;
}

export class FeedbackService {
  async submitFeedback(user: AuthUser, feedback: FeedbackData): Promise<void> {
    try {
      const feedbackSubmission: FeedbackSubmission = {
        ...feedback,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
        appVersion: '1.0.0', // You can get this from package.json
        platform: 'mobile',
      };

      await addDoc(collection(db, 'feedback'), feedbackSubmission);

      console.log('✅ Feedback submitted successfully');
    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      throw error;
    }
  }

  async getFeedbackSummary(): Promise<{
    totalFeedback: number;
    averageRating: number;
    categoryBreakdown: Record<string, number>;
    userTypeBreakdown: Record<string, number>;
  }> {
    return {
      totalFeedback: 0,
      averageRating: 0,
      categoryBreakdown: {},
      userTypeBreakdown: {},
    };
  }
}

export const feedbackService = new FeedbackService();
