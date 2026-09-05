import { create } from "zustand";

export const kaartlagenState = create<{
  selectedLayers: string[];
  setSelectedLayers: (selectedLayers: string[]) => void;
}>((set) => ({
  selectedLayers: [],
  setSelectedLayers: (selectedLayers: string[]) => set({ selectedLayers }),
}));
