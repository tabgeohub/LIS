import { EnrichedPointType } from "Types";
import { create } from "zustand";

interface TemplateFlightState {
  step: number;
  setStep: (value: number) => void;

  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;

  selectedPoints2: number[];
  setSelectedPoints2: (value: number[]) => void;

  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (value: __esri.Graphic | null) => void;

  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (value: __esri.Graphic[]) => void;

  points: EnrichedPointType[];
  setPoints: (value: EnrichedPointType[]) => void;

  clear: () => void;
}

export const useTemplateFlightState = create<TemplateFlightState>((set) => ({
  step: 1,
  setStep: (value) => set({ step: value }),

  selectedPoints: [],
  setSelectedPoints: (value) => set({ selectedPoints: value }),

  selectedPoints2: [],
  setSelectedPoints2: (value) => set({ selectedPoints2: value }),

  hoveredGraphic: null,
  setHoveredGraphic: (value) => set({ hoveredGraphic: value }),

  selectedGraphics: [],
  setSelectedGraphics: (value) => set({ selectedGraphics: value }),

  points: [],
  setPoints: (value) => set({ points: value }),

  clear: () =>
    set({
      step: 1,
      setStep: (value) => set({ step: value }),

      selectedPoints: [],
      setSelectedPoints: (value) => set({ selectedPoints: value }),

      selectedPoints2: [],
      setSelectedPoints2: (value) => set({ selectedPoints2: value }),

      hoveredGraphic: null,
      setHoveredGraphic: (value) => set({ hoveredGraphic: value }),

      selectedGraphics: [],
      setSelectedGraphics: (value) => set({ selectedGraphics: value }),

      points: [],
      setPoints: (value) => set({ points: value }),
    }),
}));
