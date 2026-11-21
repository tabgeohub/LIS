import { create } from "zustand";

export type PilotenWaarnemersStep = "chooser" | "piloten" | "waarnemers";

export const usePilotenWaarnemersStep = create<{
  step: PilotenWaarnemersStep;
  setStep: (step: PilotenWaarnemersStep) => void;
  reset: () => void;
}>((set) => ({
  step: "chooser",
  setStep: (step) => set({ step }),
  reset: () => set({ step: "chooser" }),
}));
