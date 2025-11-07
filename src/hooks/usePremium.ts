import { useEffect, useState } from 'react';

import { purchaseService } from '@/src/services/PurchaseService';

interface UsePremiumResult {
  isPremium: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook to check if user has premium subscription
 *
 * @example
 * const { isPremium, loading } = usePremium();
 *
 * if (loading) return <LoadingSpinner />;
 * if (!isPremium) return <UpgradePrompt />;
 * return <PremiumFeature />;
 */
export function usePremium(): UsePremiumResult {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPremiumStatus = async () => {
    try {
      setLoading(true);
      const premium = await purchaseService.isPremium();
      setIsPremium(premium);
    } catch (error) {
      console.error('Failed to check premium status:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  return {
    isPremium,
    loading,
    refresh: checkPremiumStatus,
  };
}
