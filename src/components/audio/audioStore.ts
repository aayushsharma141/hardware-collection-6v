import { create } from "zustand";

interface AudioStore {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  toggle: () => void;
  registerToggle: (fn: () => void) => () => void;
}

let toggleHandler: (() => void) | null = null;

export const useAudioStore = create<AudioStore>((set) => ({
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  toggle: () => {
    if (toggleHandler) {
      toggleHandler();
    }
  },
  registerToggle: (fn) => {
    toggleHandler = fn;
    return () => {
      if (toggleHandler === fn) {
        toggleHandler = null;
      }
    };
  },
}));
