# FocusFit

> Focus Deeply. Move Your Body. Build Habits.

A comprehensive productivity and fitness app that combines focused work sessions with energizing exercise routines. Build consistent habits with smart notifications, personalized workouts, and detailed progress tracking.

## Features

### 🎯 **Focus & Productivity**

- **Customizable Focus Timer**: Set your preferred focus duration (5-120 minutes)
- **Auto-Start Timer**: Seamless onboarding flow that starts your first session
- **Focus Time Modal**: Easy time adjustment with slider interface
- **Visual Feedback**: Progress indicators and completion celebrations
- **Focus Sessions Tracking**: Complete history of all your focus sessions
- **Streak Tracking**: Build momentum with focus and workout streaks

### 💪 **Smart Workouts**

- **30+ Office-Friendly Exercises**: Upper body, lower body, and mobility routines
- **Multiple Difficulty Levels**: Easy, medium, and hard options to match your fitness level
- **Equipment Support**: Desk, chair, bodyweight, and minimal equipment options
- **Exercise Customization**: Exclude exercises you don't want to do
- **Step-by-Step Instructions**: Clear, detailed instructions for each exercise
- **Real-time Guidance**: Countdown timers and progress tracking
- **Workout History**: Track all your completed workouts

### 📊 **Analytics & Progress**

- **Comprehensive Analytics**: Detailed insights into your focus and workout patterns
- **Achievement System**: 12+ achievements to unlock as you progress
- **Progress Tracking**: Total sessions, duration, and streak monitoring
- **Visual Analytics**: Beautiful charts and metrics display
- **Recent Activity**: Track your last 7 days of activity

### 🔔 **Smart Notifications**

- **Daily Reminders**: Morning focus reminders to build consistent habits
- **Motivational Boost**: Afternoon reminders to maintain momentum
- **Customizable Timing**: Set your preferred reminder times
- **Cross-Platform**: Works on both iOS and Android with proper notification channels
- **Timer End Notifications**: Get notified when your focus sessions complete

### 🎨 **Personalization**

- **Theme Support**: Light and dark mode options
- **Equipment Selection**: Choose what equipment you have available
- **Difficulty Preferences**: Set your preferred workout difficulty
- **Exercise Exclusions**: Customize your workout experience
- **Notification Preferences**: Control when and how you get reminded

### 📱 **Offline Support**

- **Offline Functionality**: Continue using the app without internet connection
- **Automatic Sync**: Data syncs when connection is restored
- **Local Storage**: Sessions and progress saved locally when offline
- **Seamless Experience**: No interruption to your workflow

### 📤 **Data Export**

- **Complete Data Export**: Export all your FocusFit data
- **Multiple Formats**: JSON and CSV export options
- **Offline Data Included**: Export pending offline data
- **Comprehensive Reports**: Detailed summaries and statistics
- **Privacy Control**: Full control over your personal data

## Screenshots

<p align="center">
  <img src="assets/images/screenshot1.png" alt="Timer Screen" width="250"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/images/screenshot2.png" alt="Exercise Screen" width="250"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/images/screenshot3.png" alt="Settings Modal" width="250"/>
</p>

<p align="center">
  <img src="assets/images/screenshot4.png" alt="Settings Modal" width="250"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/images/screenshot5.png" alt="Settings Modal" width="250"/>
</p>

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:corygold-dev/FocusFit.git
   cd FocusFit
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase (for user data and authentication):

   ```bash
   # Firebase setup (see Firebase Console for configuration)
   ```

4. Start the app:
   ```bash
   npx expo start
   ```

## Running on Devices

- **iOS Simulator**: Press `i` in the terminal after starting the app
- **Android Emulator**: Press `a` in the terminal after starting the app
- **Physical Device**: Scan the QR code with the Expo Go app
- **Web Browser**: Press `w` in the terminal after starting the app

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with file-based routing
- **Authentication**: Firebase Authentication (Google, Apple, Email/Password)
- **Database**: Firebase Firestore for user data and sessions
- **Storage**: Firebase Storage for media files
- **State Management**: React Context API with unified providers
- **Notifications**: Expo Notifications with cross-platform support
- **Styling**: React Native StyleSheet with custom theme system
- **Audio**: Expo Audio with custom sound effects
- **Offline Storage**: AsyncStorage for offline data persistence
- **Data Export**: JSON/CSV export with comprehensive metadata
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
FocusFit/
├── app/                    # Expo Router screens
│   ├── (app)/             # Protected app screens
│   │   ├── index.tsx      # Main timer screen
│   │   ├── exercise.tsx    # Exercise workflow
│   │   └── onboarding.tsx    # First-time user experience
│   ├── sign-in.tsx        # Authentication screens
│   └── sign-up.tsx
├── src/                   # Source code
│   ├── components/        # UI components by feature
│   │   ├── analyticsModal/    # Analytics and progress tracking
│   │   ├── authScreen/        # Authentication UI components
│   │   ├── exerciseScreen/   # Exercise-related components
│   │   ├── settingsModal/    # Settings and data export
│   │   ├── timerScreen/      # Timer and focus components
│   │   ├── workoutChoiceModal/ # Workout selection
│   │   └── ui/               # Shared UI components
│   ├── providers/         # React Context providers
│   │   ├── AuthProvider.tsx      # Authentication and data management
│   │   ├── NotificationProvider.tsx # Daily reminders
│   │   ├── ThemeProvider.tsx    # Theme management
│   │   ├── SoundProvider.tsx    # Audio management
│   │   ├── TimerProvider.tsx    # Timer state management
│   │   └── WorkoutProvider.tsx  # Workout state management
│   ├── services/          # Business logic and API calls
│   │   ├── FirebaseAuthService.ts    # Authentication operations
│   │   ├── FirebaseDataService.ts    # Database operations
│   │   ├── SimpleOfflineService.ts   # Offline data management
│   │   └── DataExportService.ts      # Data export functionality
│   ├── hooks/             # Custom React hooks
│   │   ├── exercise/      # Exercise-related hooks
│   │   └── timer/         # Timer-related hooks
│   ├── utils/             # Helper functions and constants
│   │   ├── achievements.ts    # Achievement system
│   │   ├── exerciseUtils.ts  # Exercise utilities
│   │   ├── notifications.ts  # Notification system
│   │   └── formatTime.ts     # Time formatting utilities
│   ├── lib/               # Data definitions
│   │   └── exercises.ts      # Exercise library with instructions
│   └── styles/            # Global theme and styling
├── src/config/           # Firebase configuration
├── assets/               # Images, audio, and static files
└── config/               # App configuration
```

## Development

### Key Files

- `app/(app)/index.tsx`: Main timer screen with auto-start functionality
- `app/(app)/exercise.tsx`: Exercise workflow with step-by-step instructions
- `app/(app)/onboarding.tsx`: First-time user experience
- `src/providers/AuthProvider.tsx`: Authentication and data management
- `src/services/FirebaseDataService.ts`: Database operations and user profile management
- `src/services/SimpleOfflineService.ts`: Offline data persistence and sync
- `src/services/DataExportService.ts`: Data export functionality
- `src/utils/notifications.ts`: Daily reminder system
- `src/utils/achievements.ts`: Achievement system with 12+ unlockable achievements
- `src/lib/exercises.ts`: Exercise library with detailed instructions
- `src/config/firebase.ts`: Firebase configuration and initialization

### Key Features Implementation

#### Authentication & Data Management

- **Firebase Integration**: Complete user authentication with Google, Apple, and email/password
- **Offline Support**: Automatic data sync when connection is restored
- **Data Export**: Comprehensive JSON/CSV export with metadata

#### Analytics & Progress Tracking

- **Achievement System**: 12+ achievements with progress tracking
- **Analytics Dashboard**: Comprehensive insights into user patterns
- **Streak Tracking**: Focus and workout streak monitoring
- **Progress Visualization**: Beautiful charts and metrics display

#### Exercise System

- **30+ Office-Friendly Exercises**: Upper body, lower body, and mobility routines
- **Step-by-Step Instructions**: Clear, detailed instructions for each exercise
- **Equipment Customization**: Choose available equipment and exclude unwanted exercises
- **Difficulty Levels**: Easy, medium, and hard options

#### Notification System

- **Daily Reminders**: Smart notification scheduling with user preferences
- **Cross-Platform**: iOS and Android notification channels
- **Customizable**: Users can enable/disable different reminder types
- **Sound Integration**: Custom audio cues for different notification types

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under a proprietary license - see the [LICENSE](LICENSE) file for details.

The FocusFit application and its source code are copyright © 2024 Cory Gold. All rights reserved.

This software is protected under copyright law and international treaties. No part of this software may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the copyright owner.

## Acknowledgments

- [Expo](https://expo.dev) - The React Native framework used
- [Firebase](https://firebase.google.com/) - Backend services and authentication
- [React Native Community](https://reactnative.dev/community/overview) - For their amazing components and tools

---

_Built with ❤️ for productivity and fitness enthusiasts_
