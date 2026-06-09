import { EnrichedPointType } from "Types";
import { create } from "zustand";

interface TemplateFlightState {
  step: number;
  setStep: (value: number) => void;

  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;

  selectedPoints2: number[];
  setSelectedPoints2: (value: number[]) => void;

  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;

  selectedGeometries2: number[];
  setSelectedGeometries2: (value: number[]) => void;

  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (value: __esri.Graphic | null) => void;

  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (value: __esri.Graphic[]) => void;

  points: EnrichedPointType[];
  setPoints: (value: EnrichedPointType[]) => void;

  clear: () => void;
}

const initialState = {
  step: 1,
  selectedPoints: [] as number[],
  selectedPoints2: [] as number[],
  selectedGeometries: [] as number[],
  selectedGeometries2: [] as number[],
  hoveredGraphic: null as __esri.Graphic | null,
  selectedGraphics: [] as __esri.Graphic[],
  points: [] as EnrichedPointType[],
};

export const useTemplateFlightState = create<TemplateFlightState>((set) => ({
  ...initialState,
  setStep: (value) => set({ step: value }),
  setSelectedPoints: (value) => set({ selectedPoints: value }),
  setSelectedPoints2: (value) => set({ selectedPoints2: value }),
  setSelectedGeometries: (value) => set({ selectedGeometries: value }),
  setSelectedGeometries2: (value) => set({ selectedGeometries2: value }),
  setHoveredGraphic: (value) => set({ hoveredGraphic: value }),
  setSelectedGraphics: (value) => set({ selectedGraphics: value }),
  setPoints: (value) => set({ points: value }),
  clear: () => set(initialState),
}));
