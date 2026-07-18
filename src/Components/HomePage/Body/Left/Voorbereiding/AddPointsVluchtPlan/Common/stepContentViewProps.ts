import type { Geometry } from "hooks/features/useGeometriesStore";

export type StepContentViewProps = {
  herhalen: boolean;
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
  setFilteredPoints: (value: any[]) => void;
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
