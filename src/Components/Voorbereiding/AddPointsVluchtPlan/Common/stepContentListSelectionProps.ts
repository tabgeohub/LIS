import type { Geometry } from "hooks/features";

/** Shared list selection props for AddPointsVluchtPlan step content. */
export type StepContentListSelectionProps = {
  filterTerm: string;
  setFilterTerm: (value: string) => void;
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  filteredGeometries: Geometry[];
  displayedGeometries: Geometry[];
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  displayedPoints: unknown[];
  buttons: React.ReactNode;
};
