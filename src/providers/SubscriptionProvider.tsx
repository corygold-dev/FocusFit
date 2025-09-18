import { SubscriptionDetails, SubscriptionTier } from '@/src/models';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthProvider';

interface SubscriptionContextType {
  subscription: SubscriptionDetails | null;
  isLoading: boolean;
  isPremium: boolean;
  refreshSubscription: () => Promise<void>;
  upgradeToPremium: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isLoading: true,
  isPremium: false,
  refreshSubscription: async () => {},

  upgradeToPremium: async () => false,
});

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  const isPremium = subscription?.tier === 'premium' && subscription?.isActive;

  const refreshSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userAttributes = await fetchUserAttributes();
      const tier = (userAttributes['custom:subscriptionTier'] as SubscriptionTier) || 'free';
      setSubscription({
        tier,
        isActive: true,
      });
    } catch (error) {
      console.error('Error getting subscription:', error);
      setSubscription({
        tier: 'free',
        isActive: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const upgradeToPremium = async (): Promise<boolean> => {
    try {
      await updateUserAttributes({
        userAttributes: {
          'custom:subscriptionTier': 'premium',
        },
      });

      await refreshSubscription();

      return true;
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      return false;
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [isAuthenticated, refreshSubscription, user]);

  const contextValue: SubscriptionContextType = {
    subscription,
    isLoading,
    isPremium,
    refreshSubscription,

    upgradeToPremium,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>{children}</SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => useContext(SubscriptionContext);
