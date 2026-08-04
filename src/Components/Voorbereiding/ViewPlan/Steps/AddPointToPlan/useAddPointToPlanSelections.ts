import { useMemo, useState } from "react";
import { usePointsStore } from "hooks/features";
import { useGeometriesStore } from "hooks/features";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import {
  filterGeometriesNotInPlan,
  filterPointsNotInPlan,
} from "./filterAddPointToPlanItems";

export function useAddPointToPlanSelections() {
  const { dbPoints } = usePointsStore();
  const { dbGeometries } = useGeometriesStore();
  const { selectedPlan } = useViewPlanState();
  const [filter, setFilter] = useState("");
  const [selectedPointIds, setSelectedPointIds] = useState<number[]>([]);
  const [selectedGeometryIds, setSelectedGeometryIds] = useState<number[]>([]);
  const filteredPoints = useMemo(
    () => filterPointsNotInPlan(dbPoints, selectedPlan),
    [dbPoints, selectedPlan]
  );
  const filteredGeometries = useMemo(
    () => filterGeometriesNotInPlan(dbGeometries, selectedPlan),
    [dbGeometries, selectedPlan]
  );
  return {
    dbPoints,
    filter,
    setFilter,
    selectedPointIds,
    setSelectedPointIds,
    selectedGeometryIds,
    setSelectedGeometryIds,
    filteredPoints,
    filteredGeometries,
  };
}
