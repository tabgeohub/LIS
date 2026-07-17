import type {
  PlanContentSelectionSetters,
  PlanContentSelectionValues,
} from "./planContentSelectionTypes";

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
