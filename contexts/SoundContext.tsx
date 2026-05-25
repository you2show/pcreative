import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playHover: () => void;
  playSuccess: () => void;
  playTransition: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Web Audio API based sound effects
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (frequency: number, duration: number, volume: number = 0.1, type: OscillatorType = 'sine') => {
  if (!audioContext) return;
  try {
    if (audioContext.state === 'suspended') audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    // Silently fail
  }
};

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('ponloe_sound') !== 'off';
  });

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('ponloe_sound', next ? 'on' : 'off');
      return next;
    });
  };

  const playClick = useCallback(() => {
    if (!soundEnabled) return;
    playTone(800, 0.08, 0.05, 'sine');
  }, [soundEnabled]);

  const playHover = useCallback(() => {
    if (!soundEnabled) return;
    playTone(600, 0.05, 0.02, 'sine');
  }, [soundEnabled]);

  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;
    playTone(523, 0.1, 0.05, 'sine');
    setTimeout(() => playTone(659, 0.1, 0.05, 'sine'), 100);
    setTimeout(() => playTone(784, 0.15, 0.05, 'sine'), 200);
  }, [soundEnabled]);

  const playTransition = useCallback(() => {
    if (!soundEnabled) return;
    playTone(440, 0.15, 0.03, 'triangle');
  }, [soundEnabled]);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playClick, playHover, playSuccess, playTransition }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within SoundProvider');
  return ctx;
};
