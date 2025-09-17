# 2 Minute Fit App
 > Stay Fit. Stay Focused.

A minimalist workout app that helps you stay fit with quick, effective exercise routines that adapt to your equipment and preferences.

## Features

- **Focus Timer**: Customizable countdown timer to prepare for your workout
- **Adaptive Workouts**: Exercises tailored to available equipment and difficulty preference
- **Multiple Difficulty Levels**: Easy, medium, and hard options to match your fitness level
- **Equipment Selection**: Support for TRX, kettlebells, resistance bands, and more
- **Dark/Light Themes**: Choose your preferred theme or match your system settings
- **Sound Notifications**: Audio cues to guide your workout progress

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
   git clone git@github.com:corygold-dev/2min.fit-app.git
   cd 2min.fit-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the app:
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
- **State Management**: React Context API
- **Styling**: React Native StyleSheet
- **Audio**: Expo Audio

## Project Structure

```
2min.fit-app/
├── app/                 # Main screens and application logic
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Core application libraries
│   └── providers/       # React Context providers
├── assets/              # Images, audio, and other static files
├── components/          # UI components organized by feature
│   ├── exerciseScreen/  # Exercise-related components
│   ├── settingsModal/   # Settings-related components
│   ├── timerScreen/     # Timer-related components
│   └── ui/              # Shared UI components
├── styles/              # Global styles and theme configuration
└── utils/               # Helper functions and constants
```

## Development

### Key Files

- `app/index.tsx`: Main timer screen
- `app/exercise.tsx`: Exercise workflow screen
- `utils/constants.ts`: App-wide constants and types
- `components/settingsModal/SettingsModal.tsx`: User preferences interface

### Customizing Exercises

Add new exercises in `app/lib/exercises.ts` following the existing structure:

```typescript
{
  name: "Exercise Name",
  duration: 30, // in seconds
  difficulty: ["easy", "medium", "hard"], // difficulty levels the exercise is suitable for
  category: "upper", // upper, lower, full, or mobility
  equipment: ["TRX"] // optional
}
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under a proprietary license - see the [LICENSE](LICENSE) file for details.

The 2min.fit application and its source code are copyright © 2023 Cory Gold. All rights reserved.

This software is protected under copyright law and international treaties. No part of this software may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the copyright owner.

## Acknowledgments

- [Expo](https://expo.dev) - The React Native framework used
- [React Native Community](https://reactnative.dev/community/overview) - For their amazing components and tools

---

_Built with ❤️ for fitness/tech enthusiasts_
