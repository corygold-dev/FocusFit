// models/subscription.ts
export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionDetails {
  tier: SubscriptionTier;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

export const SUBSCRIPTION_FEATURES = {
  free: ['Access to basic exercises', 'Daily streak tracking'],
  premium: [
    'Access to all exercises',
    'Daily streak tracking',
    'Activity heatmap',
    'Custom difficulty settings',
    'Offline access to workouts',
  ],
};
