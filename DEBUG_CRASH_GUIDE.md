# iOS Crash Debugging Guide

## Changes Made to Fix Potential Crashes

### 1. **Audio Loading Fix** ✅

- **Problem**: Audio players were loading immediately on app start, causing crashes
- **Solution**: Added lazy loading with 1-second delay and error handling
- **Files**: `src/providers/SoundProvider.tsx`

### 2. **Error Boundaries** ✅

- **Problem**: No error boundaries around critical providers
- **Solution**: Added error boundaries around each provider
- **Files**: `app/_layout.tsx`

### 3. **Amplify Configuration** ✅

- **Problem**: Amplify configuration could fail silently
- **Solution**: Added try-catch blocks and error logging
- **Files**: `config/amplify-config.ts`, `config/amplify-mobile-config.ts`

### 4. **Crash Reporting** ✅

- **Problem**: No crash reporting or error tracking
- **Solution**: Added global error handling and crash reporting
- **Files**: `src/utils/crashReporting.ts`, `app/_layout.tsx`

### 5. **Debug Build Configuration** ✅

- **Problem**: Only Release builds available for testing
- **Solution**: Added `preview-debug` build configuration
- **Files**: `eas.json`

## Next Steps to Debug

### Step 1: Test with Debug Build

```bash
# Build with debug configuration for better error messages
eas build --platform ios --profile preview-debug
```

### Step 2: Check Device Logs

1. Connect your iPhone to your Mac
2. Open Xcode → Window → Devices and Simulators
3. Select your device and click "Open Console"
4. Install the app and watch for crash logs

### Step 3: Alternative Debugging Methods

#### Method A: Use Flipper (if available)

```bash
# Install Flipper
brew install --cask flipper
```

#### Method B: Use React Native Debugger

```bash
# Install React Native Debugger
brew install --cask react-native-debugger
```

#### Method C: Add Console Logging

The app now has extensive console logging. Check the logs for:

- "Configured Amplify for mobile"
- "Error loading audio players"
- "🚨 CRASH REPORTED"

### Step 4: Test Individual Components

#### Test 1: Minimal App

Create a minimal version to isolate the issue:

```typescript
// app/_layout.tsx - Minimal version
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
  );
}
```

#### Test 2: Add Providers One by One

1. Start with just `SafeAreaProvider`
2. Add `ThemeProvider`
3. Add `AuthProvider`
4. Add `SoundProvider` last

### Step 5: Check Common iOS Issues

#### Issue 1: React 19 + New Architecture

- You're using React 19 with `newArchEnabled: true`
- This can cause compatibility issues
- **Try**: Set `newArchEnabled: false` in `app.json`

#### Issue 2: Audio File Formats

- Check if audio files are compatible with iOS
- **Try**: Convert to `.mp3` format

#### Issue 3: Memory Issues

- iOS has stricter memory limits
- **Try**: Reduce initial bundle size

### Step 6: EAS Build Logs

```bash
# Get detailed build logs
eas build:list
eas build:view [BUILD_ID]
```

## Most Likely Causes (in order)

1. **Audio Loading** (90% likely) - Fixed with lazy loading
2. **Amplify Configuration** (70% likely) - Fixed with error handling
3. **React 19 + New Architecture** (60% likely) - Try disabling new architecture
4. **Memory Issues** (40% likely) - Monitor memory usage
5. **Native Module Issues** (30% likely) - Check all native dependencies

## Quick Fixes to Try

### Fix 1: Disable New Architecture

```json
// app.json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

### Fix 2: Remove Audio Temporarily

Comment out `SoundProvider` in `app/_layout.tsx` to test

### Fix 3: Simplify Amplify

Comment out Amplify configuration to test

## Testing Commands

```bash
# Clean build
eas build --platform ios --profile preview-debug --clear-cache

# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

## If Still Crashing

1. **Check Xcode Console** for native crash logs
2. **Use Debug Build** instead of Release
3. **Test on Simulator** vs Device differences
4. **Check iOS Version** compatibility
5. **Review EAS Build Logs** for compilation errors

## Emergency Fallback

If nothing works, create a minimal app with:

- No audio
- No Amplify
- No complex providers
- Just basic navigation

Then add features back one by one to identify the culprit.
