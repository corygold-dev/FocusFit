const config = {
  expo: {
    name: 'FocusFit',
    slug: 'focusfit',
    version: '1.1.4 ',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.corygold.focusfit',
      buildNumber: '6',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        CFBundleURLTypes: [
          {
            CFBundleURLName: 'focusfit',
            CFBundleURLSchemes: ['focusfit'],
          },
          {
            CFBundleURLName: 'google',
            CFBundleURLSchemes: [
              // Include both dev and prod for local testing
              'com.googleusercontent.apps.656594687409-0ih862mdio9ioc4d2eqe95cqoad4ghvg', // dev
              'com.googleusercontent.apps.912307609119-e3k98jadmqkkgnfokdlvesqii32cqmob', // prod
            ],
          },
        ],
      },
      entitlements: {
        'com.apple.developer.applesignin': ['Default'],
      },
      scheme: 'focusfit',
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/icon.png',
      },
      edgeToEdgeEnabled: true,
      package: 'com.corygold.focusfit',
      scheme: 'focusfit',
      versionCode: 7,
    },
    web: {
      output: 'static',
      favicon: './assets/images/icon.png',
    },
    plugins: [
      'expo-router',
      'expo-splash-screen',
      'expo-font',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            extraPods: [
              {
                name: 'RCT-Folly',
                podspec:
                  '../node_modules/react-native/third-party-podspecs/RCT-Folly.podspec',
              },
            ],
            podfileProperties: {
              EXPO_POD_REPO_UPDATE: 'true',
            },
          },
        },
      ],
      'expo-audio',
      'expo-web-browser',
      [
        'expo-notifications',
        {
          icon: './assets/images/icon.png',
          color: '#ffffff',
          defaultChannel: 'default',
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme:
            'com.googleusercontent.apps.656594687409-0ih862mdio9ioc4d2eqe95cqoad4ghvg', // dev
          iosClientId:
            process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
            '656594687409-0ih862mdio9ioc4d2eqe95cqoad4ghvg.apps.googleusercontent.com',
          androidClientId:
            process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
            '656594687409-op9bqd772uphlqc83rejnbq3jmhln5ad.apps.googleusercontent.com',
        },
      ],
      'expo-asset',
      'react-native-iap',
    ],
    splash: {
      image: './assets/images/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#3B82F6',
    },
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '79cdd2e1-1995-43cd-853b-ef426fe14be3',
      },
    },
    owner: 'corygold',
  },
};

export default config;
