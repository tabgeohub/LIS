import type { EnrichedPointType } from "Types";

export type PlanContentSelectionValues = {
  step: number;
  selectedPoints: number[];
  selectedPoints2: number[];
  selectedGeometries: number[];
  selectedGeometries2: number[];
  hoveredGraphic: __esri.Graphic | null;
  selectedGraphics: __esri.Graphic[];
  points: EnrichedPointType[];
};

export type PlanContentSelectionSetters = {
  setStep: (value: number) => void;
  setSelectedPoints: (value: number[]) => void;
  setSelectedPoints2: (value: number[]) => void;
  setSelectedGeometries: (value: number[]) => void;
  setSelectedGeometries2: (value: number[]) => void;
  setHoveredGraphic: (value: __esri.Graphic | null) => void;
  setSelectedGraphics: (value: __esri.Graphic[]) => void;
  setPoints: (value: EnrichedPointType[]) => void;
};

export const emptyPlanContentSelection: PlanContentSelectionValues = {
  step: 1,
  selectedPoints: [],
  selectedPoints2: [],
  selectedGeometries: [],
  selectedGeometries2: [],
  hoveredGraphic: null,
  selectedGraphics: [],
  points: [],
};

export function createPlanContentSelectionSetters(
  set: (partial: Partial<PlanContentSelectionValues>) => void
): PlanContentSelectionSetters {
  return {
    setStep: (value) => set({ step: value }),
    setSelectedPoints: (value) => set({ selectedPoints: value }),
    setSelectedPoints2: (value) => set({ selectedPoints2: value }),
    setSelectedGeometries: (value) => set({ selectedGeometries: value }),
    setSelectedGeometries2: (value) => set({ selectedGeometries2: value }),
    setHoveredGraphic: (value) => set({ hoveredGraphic: value }),
    setSelectedGraphics: (value) => set({ selectedGraphics: value }),
    setPoints: (value) => set({ points: value }),
  };
}
