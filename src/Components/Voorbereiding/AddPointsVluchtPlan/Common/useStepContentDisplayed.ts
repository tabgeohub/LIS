import { useMemo, useState } from "react";
import type { Geometry } from "hooks/features";
import {
  filterDisplayedGeometries,
  filterDisplayedPoints,
} from "./stepContentFilters";

export function useStepContentDisplayed(input: {
  filteredPoints: any[];
  filteredGeometries: Geometry[];
  selectedPlanPointIds: number[];
  filterTerm: string;
}) {
  const displayedPoints = useMemo(
    () =>
      filterDisplayedPoints({
        points: input.filteredPoints,
        filterTerm: input.filterTerm,
        selectedPlanPointIds: input.selectedPlanPointIds,
      }),
    [input.filteredPoints, input.filterTerm, input.selectedPlanPointIds]
  );

  const displayedGeometries = useMemo(
    () =>
      filterDisplayedGeometries(input.filteredGeometries, input.filterTerm),
    [input.filteredGeometries, input.filterTerm]
  );

  return { displayedPoints, displayedGeometries };
}

export function useStepContentLocalState() {
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGeometries, setSelectedGeometries] = useState<number[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<Geometry[]>([]);
  return {
    filterTerm,
    setFilterTerm,
    selectedGeometries,
    setSelectedGeometries,
    filteredGeometries,
    setFilteredGeometries,
  };
}
