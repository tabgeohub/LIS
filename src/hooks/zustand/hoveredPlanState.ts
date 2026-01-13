import { EnrichedPointType } from "Types";
import { create } from "zustand";

export const useHoveredPlanState = create<{
  hoveredPoints: EnrichedPointType[] | null;
  setHoveredPoints: (hoveredPoints: EnrichedPointType[] | null) => void;
}>((set) => ({
  hoveredPoints: null,
  setHoveredPoints: (hoveredPoints: EnrichedPointType[] | null) =>
    set({ hoveredPoints }),
}));
