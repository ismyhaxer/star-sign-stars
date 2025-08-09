import { useCallback, useRef } from 'react';

export const useSounds = () => {
  const audioContext = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const createTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    initAudio();
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  }, [initAudio]);

  const playCorrect = useCallback(() => {
    // Upward chord progression for correct answer
    createTone(523, 0.15); // C5
    setTimeout(() => createTone(659, 0.15), 100); // E5
    setTimeout(() => createTone(784, 0.2), 200); // G5
  }, [createTone]);

  const playIncorrect = useCallback(() => {
    // Downward progression for incorrect answer
    createTone(349, 0.3, 'square'); // F4
    setTimeout(() => createTone(294, 0.4, 'square'), 150); // D4
  }, [createTone]);

  const playTick = useCallback(() => {
    // Quick tick sound for timer
    createTone(800, 0.05, 'square');
  }, [createTone]);

  const playCritical = useCallback(() => {
    // Urgent beep for timer critical
    createTone(1000, 0.1, 'triangle');
  }, [createTone]);

  const playSelect = useCallback(() => {
    // Selection sound
    createTone(440, 0.1, 'sine');
  }, [createTone]);

  const playGameOver = useCallback(() => {
    // Game over fanfare
    createTone(392, 0.2); // G4
    setTimeout(() => createTone(523, 0.2), 100); // C5
    setTimeout(() => createTone(659, 0.2), 200); // E5
    setTimeout(() => createTone(784, 0.4), 300); // G5
  }, [createTone]);

  return {
    playCorrect,
    playIncorrect,
    playTick,
    playCritical,
    playSelect,
    playGameOver
  };
};