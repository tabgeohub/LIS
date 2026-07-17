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
