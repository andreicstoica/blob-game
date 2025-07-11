import { create } from 'zustand';

interface IntroStore {
  showIntro: boolean;
  startIntro: () => void;
  endIntro: () => void;
}

export const useIntroStore = create<IntroStore>(set => ({
  showIntro: false,
  startIntro: () => set({ showIntro: true }),
  endIntro: () => set({ showIntro: false }),
})); 