import { useMemo, useState } from "react";
import { Geometry } from "hooks/features/useGeometriesStore";
import { useRenderLocalGeometries } from "hooks/features/useRenderLocalGeometries";
import { useHoverPointsAndGeometries } from "hooks/features/useHoverPointsAndGeometries";
import Filter from "../Common/Filter";
import {
  filterDisplayedGeometries,
  filterDisplayedPoints,
} from "./stepContentFilters";
import { useStepContentMapSync } from "./useStepContentMapSync";
import { useStepContentDataInit } from "./useStepContentDataInit";
import StepContentLists from "./StepContentLists";

interface StepContentProps {
  herhalen: boolean;
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  filteredPoints: any[];
  setFilteredPoints: (value: any[]) => void;
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
  selectedPlan: any;
  buttons: React.ReactNode;
}

export default function StepContent({
  herhalen,
  selectedPoints,
  setSelectedPoints,
  filteredPoints,
  setFilteredPoints,
  openFilter,
  setOpenFilter,
  selectedPlan,
  buttons,
}: StepContentProps) {
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedGeometries, setSelectedGeometries] = useState<number[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<Geometry[]>([]);

  const selectedPlanPointIds = useMemo(
    () => selectedPlan?.points?.map((p: { id: number }) => p.id) ?? [],
    [selectedPlan?.points]
  );

  const displayedPoints = useMemo(
    () =>
      filterDisplayedPoints({
        points: filteredPoints,
        filterTerm,
        selectedPlanPointIds,
      }),
    [filteredPoints, filterTerm, selectedPlanPointIds]
  );

  const displayedGeometries = useMemo(
    () => filterDisplayedGeometries(filteredGeometries, filterTerm),
    [filteredGeometries, filterTerm]
  );

  useStepContentDataInit({
    herhalen,
    selectedPlanPointIds,
    setFilteredPoints,
    setFilteredGeometries,
  });
  useStepContentMapSync(displayedPoints);
  useRenderLocalGeometries(displayedGeometries);
  useHoverPointsAndGeometries({ checkMapContainer: true });

  return (
    <div className="p-1.5 h-full">
      {!openFilter && (
        <StepContentLists
          herhalen={herhalen}
          filterTerm={filterTerm}
          setFilterTerm={setFilterTerm}
          selectedGeometries={selectedGeometries}
          setSelectedGeometries={setSelectedGeometries}
          filteredGeometries={filteredGeometries}
          displayedGeometries={displayedGeometries}
          selectedPoints={selectedPoints}
          setSelectedPoints={setSelectedPoints}
          displayedPoints={displayedPoints}
          buttons={buttons}
        />
      )}

      {openFilter && (
        <Filter
          herhalen={herhalen}
          setOpenFilter={setOpenFilter}
          setFilteredPoints={setFilteredPoints}
        />
      )}
    </div>
  );
}
