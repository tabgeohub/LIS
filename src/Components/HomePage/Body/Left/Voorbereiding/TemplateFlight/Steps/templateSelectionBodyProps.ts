import type { ReactNode } from "react";
import type { Geometry } from "hooks/features/useGeometriesStore";
import type { EnrichedPointType } from "Types";

export type TemplateSelectionBodyProps = {
  text: string;
  step: number;
  filterText: string;
  setFilterText: (value: string) => void;
  displayedGeometries: Geometry[];
  displayedPoints: EnrichedPointType[];
  selectedPoints: number[];
  setSelectedPoints: (points: number[]) => void;
  selectedGeometries: number[];
  setSelectedGeometries: (geometries: number[]) => void;
  buttons: ReactNode;
};
