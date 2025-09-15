import { AudioPlayer } from 'expo-audio';

export async function playSound(sound: AudioPlayer) {
  await sound.seekTo(0);
  sound.play();
}
