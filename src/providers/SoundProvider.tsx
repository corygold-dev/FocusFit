import { audio } from '@/assets';
import { useAudioPlayer } from 'expo-audio';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type AudioPlayer = ReturnType<typeof useAudioPlayer>;

type SoundContextType = {
  playSmallBeep: () => void;
  playFinalBeep: () => void;
  playEndSound: () => void;
  isReady: boolean;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [audioPlayers, setAudioPlayers] = useState<{
    smallBeep?: AudioPlayer;
    finalBeep?: AudioPlayer;
    endSound?: AudioPlayer;
  }>({});

  const smallBeep = useAudioPlayer(audio.smallBeep);
  const finalBeep = useAudioPlayer(audio.finalBeep);
  const endSound = useAudioPlayer(audio.finishSound);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        setAudioPlayers({ smallBeep, finalBeep, endSound });
        setIsReady(true);
      } catch (error) {
        console.error('Error loading audio players:', error);
        setIsReady(true);
      }
    };

    const timer = setTimeout(loadAudio, 1000);
    return () => clearTimeout(timer);
  }, [smallBeep, finalBeep, endSound]);

  const playSmallBeep = useCallback(() => {
    if (!isReady || !audioPlayers.smallBeep) return;
    try {
      audioPlayers.smallBeep.seekTo(0);
      audioPlayers.smallBeep.play();
    } catch (error) {
      console.error('Error playing small beep:', error);
    }
  }, [isReady, audioPlayers.smallBeep]);

  const playFinalBeep = useCallback(() => {
    if (!isReady || !audioPlayers.finalBeep) return;
    try {
      audioPlayers.finalBeep.seekTo(0);
      audioPlayers.finalBeep.play();
    } catch (error) {
      console.error('Error playing final beep:', error);
    }
  }, [isReady, audioPlayers.finalBeep]);

  const playEndSound = useCallback(() => {
    if (!isReady || !audioPlayers.endSound) return;
    try {
      audioPlayers.endSound.seekTo(0);
      audioPlayers.endSound.play();
    } catch (error) {
      console.error('Error playing end sound:', error);
    }
  }, [isReady, audioPlayers.endSound]);

  return (
    <SoundContext.Provider
      value={{ playSmallBeep, playFinalBeep, playEndSound, isReady }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSounds must be used within SoundProvider');
  return context;
};
