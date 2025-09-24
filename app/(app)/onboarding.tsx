import { createStyles } from '@/src/components/onboardingScreen/styles/onboarding.styles';
import Button from '@/src/components/ui/Button';
import { useTheme, useTimerContext } from '@/src/providers';
import { TIMER } from '@/src/utils/constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setShouldAutoStart, setSelectedFocusTime } = useTimerContext();
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [buttonOpacity] = useState(new Animated.Value(0));
  const [titleOpacity] = useState(new Animated.Value(0));
  const [welcomeOpacity] = useState(new Animated.Value(0));
  const [subtitleOpacity] = useState(new Animated.Value(0));
  const [timeSelectionOpacity] = useState(new Animated.Value(0));
  const styles = createStyles(theme);

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(timeSelectionOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, welcomeOpacity, subtitleOpacity, timeSelectionOpacity]);

  const handleTimeSelection = (time: number) => {
    setSelectedTime(time);
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleStart = () => {
    if (selectedTime) {
      setSelectedFocusTime(selectedTime);
      setShouldAutoStart(true);
      router.replace('/(app)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
          <Text style={styles.title}>Welcome to FocusFit</Text>
        </Animated.View>

        <Animated.View style={[styles.welcomeContainer, { opacity: welcomeOpacity }]}>
          <Text style={styles.welcomeText}>We're happy you're here</Text>
        </Animated.View>

        <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.subtitle}>
            Focus deeply, then move your body. The perfect blend of productivity and fitness.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.timeSelection, { opacity: timeSelectionOpacity }]}>
          <Text style={styles.timeLabel}>How long would you like to focus for?</Text>
          <View style={styles.presetGrid}>
            {TIMER.PRESET_MINUTES.map((preset) => (
              <Button
                key={preset.value}
                title={preset.label}
                variant={selectedTime === preset.value ? 'primary' : 'secondary'}
                onPress={() => handleTimeSelection(preset.value)}
                style={[
                  styles.presetButton,
                  selectedTime === preset.value && styles.selectedPreset,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.startButtonContainer, { opacity: buttonOpacity }]}>
          <Button
            title="Lock In"
            variant="primary"
            onPress={handleStart}
            disabled={!selectedTime}
            style={styles.startButton}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
