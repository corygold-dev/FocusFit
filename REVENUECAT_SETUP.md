# 💰 RevenueCat IAP Setup Guide

This guide walks you through setting up in-app purchases for FocusFit Premium.

## ✅ What's Already Done

- [x] RevenueCat SDK installed
- [x] `PurchaseService` created
- [x] `usePremium` hook ready
- [x] Paywall screen designed
- [x] Auto-initialization on app launch

## 🚀 Setup Steps

### 1. Create RevenueCat Account

1. Go to https://www.revenuecat.com
2. Sign up (free tier: < $2,500 monthly revenue)
3. Create project: **"FocusFit"**
4. Add your app:
   - **iOS**: Bundle ID `com.corygold.focusfit`
   - **Android**: Package name `com.corygold.focusfit`

### 2. Get RevenueCat API Keys

1. Dashboard → Projects → FocusFit → API Keys
2. Copy:
   - **iOS API Key** (starts with `appl_`)
   - **Android API Key** (starts with `goog_`)

3. Add to `.env.development` and `.env.production`:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxx
```

4. Add to **EAS Secrets** (both preview & production scopes):
   - `EXPO_PUBLIC_REVENUECAT_IOS_KEY`
   - `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`

### 3. Create Subscriptions in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. My Apps → FocusFit → Features → In-App Purchases
3. Click **(+)** → Auto-Renewable Subscription
4. Create Subscription Group: **"FocusFit Premium"**

#### Monthly Subscription

```
Reference Name: FocusFit Premium Monthly
Product ID: focusfit_premium_monthly
Duration: 1 Month
Price: $4.99 USD
Free Trial: 7 Days (optional)
Description: "Unlock all FocusFit features including custom timers,
              full exercise library, and detailed analytics."
```

#### Annual Subscription (Recommended)

```
Reference Name: FocusFit Premium Annual
Product ID: focusfit_premium_yearly
Duration: 1 Year
Price: $29.99 USD (40% savings vs monthly)
Free Trial: 7 Days (optional)
Description: "Get a full year of FocusFit Premium at 40% off!
              Includes all features and priority support."
```

5. Submit for review (required before testing)

### 4. Connect App Store to RevenueCat

1. **Get App Store Shared Secret:**
   - App Store Connect → Users and Access → Keys
   - Scroll to "In-App Purchase" section
   - Click "Generate Shared Secret"
   - Copy the secret

2. **Add to RevenueCat:**
   - RevenueCat Dashboard → FocusFit → iOS
   - Scroll to "App Store Connect"
   - Paste Shared Secret
   - Click "Save"

### 5. Configure Entitlements in RevenueCat

1. RevenueCat Dashboard → FocusFit → Entitlements
2. Create entitlement: **"premium"** (lowercase!)
3. Attach products:
   - `focusfit_premium_monthly`
   - `focusfit_premium_yearly`

### 6. Test with Sandbox

1. **Create Sandbox Tester:**
   - App Store Connect → Users and Access → Sandbox Testers
   - Add new tester with unique email
   - Remember password!

2. **Test on Device:**

   ```bash
   npm run build:preview:ios
   ```

   - Install the build
   - Sign out of real Apple ID in Settings → App Store
   - Open FocusFit → Try to purchase
   - Sign in with sandbox tester account
   - Purchase should succeed instantly

3. **Verify in RevenueCat:**
   - Dashboard → Customers
   - Search for your sandbox tester
   - Should show active "premium" entitlement

## 📱 Using Premium in Your App

### Check Premium Status

```typescript
import { usePurchase } from '@/src/providers/PurchaseProvider';

function MyScreen() {
  const { isPremium, loading } = usePurchase();

  if (loading) return <Loading />;

  return isPremium ? <PremiumFeature /> : <FreeFeature />;
}
```

### Show Paywall

```typescript
import { router } from 'expo-router';

function LockedFeature() {
  return (
    <View>
      <Text>This is a premium feature</Text>
      <Button
        title="Upgrade to Premium"
        onPress={() => router.push('/(tabs)/premium')}
      />
    </View>
  );
}
```

### Gate Features

```typescript
function CustomTimerButton() {
  const { isPremium } = usePurchase();

  const handlePress = () => {
    if (!isPremium) {
      router.push('/(tabs)/premium');
      return;
    }
    // Allow custom timer
    openCustomTimerModal();
  };

  return <Button title="Custom Timer ⭐" onPress={handlePress} />;
}
```

## 🎯 Recommended Freemium Split

### Free Tier

- ✅ 25-minute Pomodoro timer (fixed)
- ✅ 10 basic exercises
- ✅ Basic streak tracking
- ✅ Leaderboard (view only)

### Premium ($4.99/mo or $29.99/yr)

- ✅ Custom timer durations (any length)
- ✅ Full exercise library (46 exercises)
- ✅ Detailed analytics (> 7 days history)
- ✅ Export data
- ✅ Custom workout routines
- ✅ Priority support

## 🧪 Testing Checklist

- [ ] Purchase monthly subscription
- [ ] Purchase annual subscription
- [ ] Verify premium features unlock
- [ ] Test "Restore Purchases" button
- [ ] Cancel subscription (verify access until period ends)
- [ ] Test on both iOS and Android
- [ ] Verify RevenueCat dashboard shows transactions

## 🚨 Before Production Launch

1. **Privacy Policy** - Update to mention subscriptions
2. **Terms of Service** - Add subscription terms
3. **App Store Review** - Mention IAP in review notes
4. **Refund Policy** - Explain how refunds work
5. **Support Email** - Set up support@focusfit.app

## 📊 Revenue Tracking

RevenueCat Dashboard shows:

- Active subscribers
- MRR (Monthly Recurring Revenue)
- Churn rate
- Trial conversions
- Revenue charts

## 🎉 You're Done!

Now you have:

- ✅ Working IAP system
- ✅ Beautiful paywall
- ✅ Easy premium checks
- ✅ Cross-platform support
- ✅ Analytics & metrics

**Next:** Test thoroughly with sandbox, then submit to App Store! 🚀
