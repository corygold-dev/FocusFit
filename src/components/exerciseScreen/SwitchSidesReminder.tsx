import { useSounds } from '@/src/providers/SoundProvider';
import React from 'react';
import { Alert } from 'react-native';

interface SwitchSidesReminderProps {
  isVisible: boolean;
}

export default function SwitchSidesReminder({
  isVisible,
}: SwitchSidesReminderProps) {
  const { playFinalBeep } = useSounds();

  React.useEffect(() => {
    if (isVisible) {
      playFinalBeep();
      Alert.alert('Switch Sides!', 'Time to switch to your other side!', [
        { text: 'Got it!', style: 'default' },
      ]);
    }
  }, [isVisible, playFinalBeep]);

  return null;
}
