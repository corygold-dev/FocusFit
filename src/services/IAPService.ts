import { Platform } from 'react-native';
import {
  finishTransaction,
  getProducts,
  initConnection,
  endConnection,
  requestPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type ProductPurchase,
  type PurchaseError,
  type Product,
} from 'react-native-iap';

export const TIP_PRODUCT_IDS = [
  'tip_small',
  'tip_medium',
  'tip_large',
] as const;

export type TipProductId = (typeof TIP_PRODUCT_IDS)[number];

export const TIP_LABELS: Record<TipProductId, string> = {
  tip_small: 'Small Tip',
  tip_medium: 'Medium Tip',
  tip_large: 'Large Tip',
};

export const TIP_EMOJIS: Record<TipProductId, string> = {
  tip_small: '\u2615',
  tip_medium: '\uD83C\uDF1F',
  tip_large: '\uD83D\uDE80',
};

class IAPService {
  private purchaseUpdateSubscription: ReturnType<
    typeof purchaseUpdatedListener
  > | null = null;
  private purchaseErrorSubscription: ReturnType<
    typeof purchaseErrorListener
  > | null = null;
  private connected = false;

  async init(
    onPurchaseSuccess: (purchase: ProductPurchase) => void,
    onPurchaseError: (error: PurchaseError) => void
  ): Promise<void> {
    if (Platform.OS === 'web') return;
    if (this.connected) return;

    try {
      await initConnection();
      this.connected = true;

      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async purchase => {
          try {
            await finishTransaction({ purchase, isConsumable: true });
            onPurchaseSuccess(purchase);
          } catch (err) {
            console.error('Failed to finish transaction:', err);
          }
        }
      );

      this.purchaseErrorSubscription = purchaseErrorListener(error => {
        if (error.code !== 'E_USER_CANCELLED') {
          onPurchaseError(error);
        }
      });
    } catch (err) {
      console.error('Failed to init IAP connection:', err);
    }
  }

  async fetchProducts(): Promise<Product[]> {
    if (Platform.OS === 'web') return [];

    try {
      const products = await getProducts({ skus: [...TIP_PRODUCT_IDS] });
      return products;
    } catch (err) {
      console.error('Failed to fetch products:', err);
      return [];
    }
  }

  async purchaseTip(productId: TipProductId): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await requestPurchase({ sku: productId });
    } catch (err) {
      console.error('Failed to request purchase:', err);
      throw err;
    }
  }

  async end(): Promise<void> {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    if (this.connected) {
      await endConnection();
      this.connected = false;
    }
  }
}

export const iapService = new IAPService();
