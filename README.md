# FocusFit

> Focus Deeply. Move Your Body. Build Habits.

A comprehensive productivity and fitness app that combines focused work sessions with energizing exercise routines. Build consistent habits with smart notifications and personalized workouts.

## Features

### 🎯 **Focus & Productivity**

- **Customizable Focus Timer**: Set your preferred focus duration (5-120 minutes)
- **Auto-Start Timer**: Seamless onboarding flow that starts your first session
- **Focus Time Modal**: Easy time adjustment with slider interface
- **Visual Feedback**: Progress indicators and completion celebrations

### 💪 **Smart Workouts**

- **Multiple Difficulty Levels**: Easy, medium, and hard options to match your fitness level
- **Equipment Support**: TRX, kettlebells, resistance bands, bodyweight, and more
- **Exercise Customization**: Exclude exercises you don't want to do
- **Real-time Guidance**: Clear instructions and countdown timers

### 🔔 **Smart Notifications**

- **Daily Reminders**: Morning focus reminders to build consistent habits
- **Motivational Boost**: Afternoon reminders to maintain momentum
- **Customizable Timing**: Set your preferred reminder times
- **Cross-Platform**: Works on both iOS and Android with proper notification channels

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
   git clone git@github.com:corygold-dev/focusfit-app.git
   cd focusfit-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure AWS Amplify (for user data and authentication):

   ```bash
   npx amplify configure
   npx amplify push
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
- **Authentication**: AWS Amplify Cognito
- **Storage**: AWS S3 for media files
- **State Management**: React Context API with unified providers
- **Notifications**: Expo Notifications with cross-platform support
- **Styling**: React Native StyleSheet with custom theme system
- **Audio**: Expo Audio with custom sound effects
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
focusfit-app/
├── app/                    # Expo Router screens
│   ├── (app)/             # Protected app screens
│   │   ├── index.tsx      # Main timer screen
│   │   ├── exercise.tsx   # Exercise workflow
│   │   └── onboarding.tsx # First-time user experience
│   ├── sign-in.tsx        # Authentication screens
│   ├── sign-up.tsx
│   └── confirm.tsx
├── src/                   # Source code
│   ├── components/        # UI components by feature
│   │   ├── exerciseScreen/   # Exercise-related components
│   │   ├── settingsModal/    # Settings and preferences
│   │   ├── timerScreen/      # Timer and focus components
│   │   ├── onboardingScreen/ # Onboarding flow
│   │   └── ui/               # Shared UI components
│   ├── providers/         # React Context providers
│   │   ├── AuthProvider.tsx      # Authentication state
│   │   ├── UserDataProvider.tsx # User profile and settings
│   │   ├── NotificationProvider.tsx # Daily reminders
│   │   ├── ThemeProvider.tsx    # Theme management
│   │   └── SoundProvider.tsx    # Audio management
│   ├── services/          # Business logic and API calls
│   │   └── UserDataService.ts   # Database operations
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions and constants
│   └── styles/            # Global theme and styling
├── amplify/              # AWS Amplify configuration
│   └── data/              # Database schema
├── assets/               # Images, audio, and static files
└── config/               # App configuration
```

## Development

### Key Files

- `app/(app)/index.tsx`: Main timer screen with auto-start functionality
- `app/(app)/exercise.tsx`: Exercise workflow
- `app/(app)/onboarding.tsx`: First-time user experience
- `src/providers/UserDataProvider.tsx`: Unified user data and settings management
- `src/services/UserDataService.ts`: Database operations and user profile management
- `src/utils/notifications.ts`: Daily reminder system
- `amplify/data/resource.ts`: DynamoDB schema for user data

### Key Features Implementation

#### User Data & Authentication

- **AWS Amplify Integration**: Complete user authentication and data storage

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
- [AWS Amplify](https://aws.amazon.com/amplify/) - Backend services and authentication
- [React Native Community](https://reactnative.dev/community/overview) - For their amazing components and tools

---

_Built with ❤️ for productivity and fitness enthusiasts_
