import { audio } from '@/assets';
import { useAudioPlayer } from 'expo-audio';
import React, { createContext, useCallback, useContext } from 'react';

type SoundContextType = {
  playSmallBeep: () => void;
  playFinalBeep: () => void;
  playEndSound: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const smallBeep = useAudioPlayer(audio.smallBeep);
  const finalBeep = useAudioPlayer(audio.finalBeep);
  const endSound = useAudioPlayer(audio.finishSound);

  const playSmallBeep = useCallback(() => {
    try {
      smallBeep.seekTo(0);
      smallBeep.play();
    } catch (error) {
      console.error('Error playing small beep:', error);
    }
  }, [smallBeep]);

  const playFinalBeep = useCallback(() => {
    try {
      finalBeep.seekTo(0);
      finalBeep.play();
    } catch (error) {
      console.error('Error playing final beep:', error);
    }
  }, [finalBeep]);

  const playEndSound = useCallback(() => {
    try {
      endSound.seekTo(0);
      endSound.play();
    } catch (error) {
      console.error('Error playing end sound:', error);
    }
  }, [endSound]);

  return (
    <SoundContext.Provider value={{ playSmallBeep, playFinalBeep, playEndSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSounds must be used within SoundProvider');
  return context;
};
