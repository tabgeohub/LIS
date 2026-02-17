import { create } from "zustand";

interface DrawingState {
  step: number;
  setStep: (value: number) => void;

  graphicsDrawn: Array<{ type: string; points: number[][] }> | null;
  setGraphicsDrawn: (value: Array<{ type: string; points: number[][] }> | null) => void;

  clear: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),

  graphicsDrawn: null,
  setGraphicsDrawn: (value) => set({ graphicsDrawn: value }),

  clear: () =>
    set({
      step: 1,
      graphicsDrawn: null,
    }),
}));

