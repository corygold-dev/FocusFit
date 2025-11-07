import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';

export class PurchaseService {
  private static instance: PurchaseService;
  private initialized = false;

  private constructor() {}

  static getInstance(): PurchaseService {
    if (!this.instance) {
      this.instance = new PurchaseService();
    }
    return this.instance;
  }

  /**
   * Initialize RevenueCat SDK
   * Call this on app launch
   */
  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;

    try {
      const apiKey = REVENUECAT_API_KEY_IOS;

      if (!apiKey || apiKey.trim() === '') {
        console.warn(
          `⚠️ RevenueCat API key not configured for ${Platform.OS}. In-app purchases will not work.`
        );
        return;
      }

      Purchases.configure({ apiKey });

      if (userId) {
        await Purchases.logIn(userId);
      }

      this.initialized = true;
      console.log('✅ RevenueCat initialized');
    } catch (error) {
      console.error('❌ RevenueCat initialization failed:', error);
    }
  }

  /**
   * Check if user has active premium subscription or lifetime purchase
   */
  async isPremium(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();

      // Check subscription entitlements (monthly/annual)
      const hasSubscription =
        customerInfo.entitlements.active['premium'] !== undefined;

      // Check lifetime purchase (non-subscription)
      const hasLifetime = customerInfo.nonSubscriptionTransactions.some(
        tx => tx.productIdentifier === 'focusfit_premium_lifetime'
      );

      return hasSubscription || hasLifetime;
    } catch (error) {
      console.error('Failed to check premium status:', error);
      return false;
    }
  }

  /**
   * Get available subscription offerings
   */
  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a subscription package
   */
  async purchasePackage(
    pkg: PurchasesPackage
  ): Promise<{ success: boolean; customerInfo?: CustomerInfo }> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return { success: true, customerInfo };
    } catch (error) {
      // User cancelled
      if ((error as { userCancelled?: boolean }).userCancelled) {
        return { success: false };
      }
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  /**
   * Get customer info (includes subscription status)
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    return await Purchases.getCustomerInfo();
  }

  /**
   * Identify user with RevenueCat
   * Call this after user signs in
   */
  async identifyUser(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      console.log('✅ User identified with RevenueCat:', userId);
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  /**
   * Logout user from RevenueCat
   * Call this when user signs out
   */
  async logoutUser(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log('✅ User logged out from RevenueCat');
    } catch (error) {
      console.error('Failed to logout user:', error);
    }
  }
}

// Singleton instance
export const purchaseService = PurchaseService.getInstance();
