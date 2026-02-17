import { create } from "zustand";

interface DrawingState {
  step: number;
  setStep: (value: number) => void;

  graphicsDrawn: Array<{ type: string; points: number[][] }> | null;
  setGraphicsDrawn: (value: Array<{ type: string; points: number[][] }> | null) => void;

  // Form states
  omschrijving: string;
  setOmschrijving: (value: string) => void;
  vertrouwelijk: boolean;
  setVertrouwelijk: (value: boolean) => void;
  herhalen: boolean;
  setHerhalen: (value: boolean) => void;
  activiteit: string;
  setActiviteit: (value: string) => void;
  organisatie: string;
  setOrganisatie: (value: string) => void;
  specifiekLettenOp: string;
  setSpecifiekLettenOp: (value: string) => void;

  clear: () => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),

  graphicsDrawn: null,
  setGraphicsDrawn: (value) => set({ graphicsDrawn: value }),

  // Form states
  omschrijving: "",
  setOmschrijving: (value) => set({ omschrijving: value }),
  vertrouwelijk: false,
  setVertrouwelijk: (value) => set({ vertrouwelijk: value }),
  herhalen: false,
  setHerhalen: (value) => set({ herhalen: value }),
  activiteit: "",
  setActiviteit: (value) => set({ activiteit: value }),
  organisatie: "",
  setOrganisatie: (value) => set({ organisatie: value }),
  specifiekLettenOp: "",
  setSpecifiekLettenOp: (value) => set({ specifiekLettenOp: value }),

  clear: () =>
    set({
      step: 1,
      graphicsDrawn: null,
      omschrijving: "",
      vertrouwelijk: false,
      herhalen: false,
      activiteit: "",
      organisatie: "",
      specifiekLettenOp: "",
    }),
}));
