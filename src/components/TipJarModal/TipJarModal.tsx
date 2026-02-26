import { useTheme } from '@/src/providers';
import {
  iapService,
  TIP_EMOJIS,
  TIP_LABELS,
  type TipProductId,
} from '@/src/services/IAPService';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Product } from 'react-native-iap';
import { tipJarModalStyles } from './styles';

interface TipJarModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TipJarModal({ visible, onClose }: TipJarModalProps) {
  const { theme } = useTheme();
  const styles = tipJarModalStyles(theme);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchaseSuccess = useCallback(() => {
    setPurchasing(false);
    Alert.alert(
      'Thank You!',
      'Your support means the world and helps keep FocusFit going!',
      [{ text: 'OK', onPress: onClose }]
    );
  }, [onClose]);

  const handlePurchaseError = useCallback((err: { message?: string }) => {
    setPurchasing(false);
    Alert.alert(
      'Purchase Failed',
      err.message || 'Something went wrong. Please try again.'
    );
  }, []);

  useEffect(() => {
    if (!visible) return;

    let mounted = true;

    const setup = async () => {
      setLoading(true);
      setError(null);

      await iapService.init(handlePurchaseSuccess, handlePurchaseError);
      const fetchedProducts = await iapService.fetchProducts();

      if (!mounted) return;

      if (fetchedProducts.length === 0) {
        setError('Unable to load tip options. Please try again later.');
      }

      // Sort products by price to ensure consistent ordering
      const sorted = [...fetchedProducts].sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return priceA - priceB;
      });

      setProducts(sorted);
      setLoading(false);
    };

    setup();

    return () => {
      mounted = false;
    };
  }, [visible, handlePurchaseSuccess, handlePurchaseError]);

  useEffect(() => {
    return () => {
      iapService.end();
    };
  }, []);

  const handleTip = async (productId: TipProductId) => {
    setPurchasing(true);
    try {
      await iapService.purchaseTip(productId);
    } catch {
      setPurchasing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Tip Jar</Text>
          <Text style={styles.subtitle}>
            Enjoying FocusFit? Leave a tip to support development!
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading tip options...</Text>
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            products.map(product => {
              const productId = product.productId as TipProductId;
              return (
                <TouchableOpacity
                  key={product.productId}
                  style={styles.tipOption}
                  onPress={() => handleTip(productId)}
                  disabled={purchasing}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tipEmoji}>
                    {TIP_EMOJIS[productId] || '\u2764\uFE0F'}
                  </Text>
                  <View style={styles.tipInfo}>
                    <Text style={styles.tipLabel}>
                      {TIP_LABELS[productId] || product.title}
                    </Text>
                    <Text style={styles.tipPrice}>
                      {product.localizedPrice}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={purchasing}
          >
            <Text style={styles.cancelText}>Close</Text>
          </TouchableOpacity>

          {purchasing && (
            <View style={styles.purchasingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
