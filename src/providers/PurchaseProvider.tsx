import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { purchaseService } from '@/src/services/PurchaseService';
import { useAuth } from './AuthProvider';

interface PurchaseContextType {
  isPremium: boolean;
  loading: boolean;
  refreshPremiumStatus: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined
);

interface PurchaseProviderProps {
  children: ReactNode;
}

export const PurchaseProvider: React.FC<PurchaseProviderProps> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    initializePurchases();
  }, [user]);

  const initializePurchases = async () => {
    try {
      // Initialize RevenueCat
      await purchaseService.initialize(user?.uid);

      // Check premium status
      await refreshPremiumStatus();
    } catch (error) {
      console.error('Failed to initialize purchases:', error);
      setLoading(false);
    }
  };

  const refreshPremiumStatus = async () => {
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

  return (
    <PurchaseContext.Provider
      value={{ isPremium, loading, refreshPremiumStatus }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = (): PurchaseContextType => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within PurchaseProvider');
  }
  return context;
};
