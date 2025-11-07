import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { SafeAreaView } from 'react-native-safe-area-context';

import { purchaseService } from '@/src/services/PurchaseService';

export default function PaywallScreen() {
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      const offering = await purchaseService.getOfferings();
      if (offering) {
        setPackages(offering.availablePackages);
        // Auto-select annual package (best value)
        const annual = offering.availablePackages.find(pkg =>
          pkg.identifier.includes('annual')
        );
        setSelectedPackage(annual || offering.availablePackages[0]);
      }
    } catch {
      Alert.alert('Error', 'Failed to load subscription options');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setPurchasing(true);
      const { success } =
        await purchaseService.purchasePackage(selectedPackage);

      if (success) {
        Alert.alert('Success!', 'Welcome to FocusFit Premium! 🎉', [
          { text: 'Start Using', onPress: () => router.back() },
        ]);
      }
    } catch (error: unknown) {
      Alert.alert(
        'Purchase Failed',
        (error as { message?: string })?.message || 'Something went wrong'
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      await purchaseService.restorePurchases();
      Alert.alert('Success', 'Purchases restored successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Restore Failed', 'No previous purchases found');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Unlock Premium</Text>
        <Text style={styles.subtitle}>Get access to all features</Text>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem icon="time" text="Custom timer durations" />
          <FeatureItem
            icon="fitness"
            text="Full exercise library (46 exercises)"
          />
          <FeatureItem
            icon="stats-chart"
            text="Detailed analytics & insights"
          />
          <FeatureItem icon="download" text="Export your data" />
          <FeatureItem icon="notifications" text="Advanced reminders" />
          <FeatureItem icon="sparkles" text="Priority support" />
        </View>

        {/* Pricing Options */}
        <View style={styles.packages}>
          {packages.map(pkg => {
            const isAnnual = pkg.identifier.includes('annual');
            const isLifetime = pkg.identifier.includes('lifetime');
            const isSelected = selectedPackage?.identifier === pkg.identifier;

            let badge = null;
            if (isAnnual) badge = 'MOST POPULAR';
            if (isLifetime) badge = 'BEST VALUE';

            return (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.package,
                  isSelected && styles.packageSelected,
                  isAnnual && styles.packagePopular,
                ]}
                onPress={() => setSelectedPackage(pkg)}
              >
                {badge && (
                  <View
                    style={[styles.badge, isLifetime && styles.badgeLifetime]}
                  >
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                )}

                <View style={styles.packageContent}>
                  <View style={styles.packageInfo}>
                    <Text
                      style={[
                        styles.packageTitle,
                        isSelected && styles.packageTitleSelected,
                      ]}
                    >
                      {isLifetime
                        ? 'Lifetime Access'
                        : isAnnual
                          ? 'Annual Plan'
                          : 'Monthly Plan'}
                    </Text>
                    <Text style={styles.packagePrice}>
                      {pkg.product.priceString}
                      {!isLifetime && `/${isAnnual ? 'year' : 'month'}`}
                    </Text>
                    {isAnnual && (
                      <Text style={styles.savingsText}>Save $25 (42% off)</Text>
                    )}
                    {isLifetime && (
                      <Text style={styles.savingsText}>
                        Pay once, own forever
                      </Text>
                    )}
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#3B82F6"
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            purchasing && styles.purchaseButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedPackage}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.purchaseButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Restore Button */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legal}>
          Payment will be charged to your Apple ID account at confirmation of
          purchase. Subscription automatically renews unless canceled at least
          24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.feature}>
      <Ionicons name={icon as any} size={24} color="#3B82F6" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingTop: 80,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    gap: 16,
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  packages: {
    gap: 12,
    marginBottom: 24,
  },
  package: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  packageSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  packagePopular: {
    borderColor: '#10B981',
  },
  packageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  packageTitleSelected: {
    color: '#3B82F6',
  },
  packagePrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  savingsText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeLifetime: {
    backgroundColor: '#F59E0B',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  restoreButton: {
    padding: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  legal: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
