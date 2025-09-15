import React, { createContext, useContext } from 'react';
import { useAudioPlayer } from 'expo-audio';
import endSoundFile from '../../assets/audio/finish-sound.wav';
import smallBeepFile from '../../assets/audio/short-beep.wav';
import finalBeepFile from '../../assets/audio/short-ping.mp3';

type SoundContextType = {
  playSmallBeep: () => void;
  playFinalBeep: () => void;
  playEndSound: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const smallBeep = useAudioPlayer(smallBeepFile);
  const finalBeep = useAudioPlayer(finalBeepFile);
  const endSound = useAudioPlayer(endSoundFile);

  const playSmallBeep = () => {
    smallBeep.seekTo(0);
    smallBeep.play();
  };

  const playFinalBeep = () => {
    finalBeep.seekTo(0);
    finalBeep.play();
  };

  const playEndSound = () => {
    endSound.seekTo(0);
    endSound.play();
  };

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
