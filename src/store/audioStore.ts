import { create } from 'zustand';
import { Howl, Howler } from 'howler';

interface AudioStore {
  isAudioEnabled: boolean;
  currentBackgroundMode: 'regular' | 'bonus' | null;
  sounds: {
    regularBg?: Howl;
    bonusMode?: Howl;
    bonus?: Howl;
    gameOver?: Howl;
    dice?: Howl;
  };
  toggleAudio: () => void;
  initializeSounds: () => void;
  playSound: (soundKey: keyof AudioStore['sounds']) => void;
  stopSound: (soundKey: keyof AudioStore['sounds']) => void;
  stopAllSounds: () => void;
  setBackgroundMusic: (mode: 'regular' | 'bonus') => void;
}

export const useAudioStore = create<AudioStore>()((set, get) => ({
  isAudioEnabled: true,
  sounds: {},
  
  toggleAudio: () => {
    const { isAudioEnabled, stopAllSounds } = get();
    const newEnabled = !isAudioEnabled;
    
    if (!newEnabled) {
      stopAllSounds();
    }
    
    // Update Howler global volume
    Howler.volume(newEnabled ? 1 : 0);
    
    set({ isAudioEnabled: newEnabled });
  },
  
  initializeSounds: () => {
    const { isAudioEnabled } = get();
    
    const sounds = {
      regularBg: new Howl({
        src: ['/assets/main/sounds/regular-bg.mp3'],
        loop: true,
        volume: 0.5,
      }),
      bonusMode: new Howl({
        src: ['/assets/main/sounds/bonus-mode.mp3'],
        loop: true,
        volume: 0.6,
      }),
      bonus: new Howl({
        src: ['/assets/main/sounds/bonus.mp3'],
        volume: 0.8,
      }),
      gameOver: new Howl({
        src: ['/assets/main/sounds/game-over.mp3'],
        volume: 0.7,
      }),
      dice: new Howl({
        src: ['/assets/main/sounds/dice.mp3'],
        volume: 0.6,
      }),
    };
    
    // Set global volume based on audio enabled state
    Howler.volume(isAudioEnabled ? 1 : 0);
    
    set({ sounds });
  },
  
  playSound: (soundKey) => {
    const { sounds, isAudioEnabled } = get();
    if (!isAudioEnabled || !sounds[soundKey]) return;
    
    const sound = sounds[soundKey];
    if (sound) {
      sound.play();
    }
  },
  
  stopSound: (soundKey) => {
    const { sounds } = get();
    const sound = sounds[soundKey];
    if (sound) {
      sound.stop();
    }
  },
  
  stopAllSounds: () => {
    const { sounds } = get();
    Object.values(sounds).forEach(sound => {
      if (sound) {
        sound.stop();
      }
    });
  },
  
  setBackgroundMusic: (mode) => {
    const { sounds, isAudioEnabled } = get();
    if (!isAudioEnabled) return;
    
    // Stop both background tracks
    sounds.regularBg?.stop();
    sounds.bonusMode?.stop();
    
    // Play the appropriate track
    if (mode === 'regular' && sounds.regularBg) {
      sounds.regularBg.play();
    } else if (mode === 'bonus' && sounds.bonusMode) {
      sounds.bonusMode.play();
    }
  },
    }));
