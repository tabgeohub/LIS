/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import {
  filterPointsForStepContent,
  matchesHerhalenValue,
} from "./stepContentFilters";

export function useStepContentDataInit(input: {
  herhalen: boolean;
  selectedPlanPointIds: number[];
  setFilteredPoints: (value: unknown[]) => void;
  setFilteredGeometries: (value: Geometry[]) => void;
}) {
  const { setPoints, dbPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();

  useEffect(() => {
    const availablePoints = filterPointsForStepContent({
      dbPoints,
      herhalen: input.herhalen,
      selectedPlanPointIds: input.selectedPlanPointIds,
    });
    setPoints(availablePoints);
    input.setFilteredPoints(availablePoints);

    const nextGeometries = dbGeometries.filter((geometry) =>
      matchesHerhalenValue({
        geometryHerhalen: geometry.herhalen,
        herhalen: input.herhalen,
      })
    );
    setGeometries(nextGeometries);
    input.setFilteredGeometries(nextGeometries);
  }, []);
}
