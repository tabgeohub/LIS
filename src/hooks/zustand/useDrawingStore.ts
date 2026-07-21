import { create } from "zustand";
import type {
  AandachtspuntDetailsFieldState,
  AandachtspuntDetailsValues,
} from "@helpers/points/aandachtspuntDetailsValues";

interface DrawingState extends AandachtspuntDetailsValues {
  step: number;
  setStep: (value: number) => void;

  graphicsDrawn: Array<{ type: string; points: number[][] }> | null;
  setGraphicsDrawn: (value: Array<{ type: string; points: number[][] }> | null) => void;

  omschrijving: string;
  setOmschrijving: (value: string) => void;

  clear: () => void;
}

const initialDetails: AandachtspuntDetailsFieldState = {
  vertrouwelijk: false,
  herhalen: false,
  activiteit: "",
  organisatie: "",
  specifiekLettenOp: "",
};

const initialState = {
  step: 1,
  graphicsDrawn: null as Array<{ type: string; points: number[][] }> | null,
  omschrijving: "",
  ...initialDetails,
};

export const useDrawingStore = create<DrawingState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setGraphicsDrawn: (value) => set({ graphicsDrawn: value }),
  setOmschrijving: (value) => set({ omschrijving: value }),
  setVertrouwelijk: (value) => set({ vertrouwelijk: value }),
  setHerhalen: (value) => set({ herhalen: value }),
  setActiviteit: (value) => set({ activiteit: value }),
  setOrganisatie: (value) => set({ organisatie: value }),
  setSpecifiekLettenOp: (value) => set({ specifiekLettenOp: value }),
  clear: () => set(initialState),
}));
