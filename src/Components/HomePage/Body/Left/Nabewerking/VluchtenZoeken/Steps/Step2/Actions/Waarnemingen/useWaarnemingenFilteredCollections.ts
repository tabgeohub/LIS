import { useMemo } from "react";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import {
  filterWaarnemingenGeometries,
  filterWaarnemingenPoints,
} from "./waarnemingenFilterHelpers";

export function useWaarnemingenFilteredCollections(
  selectedPlan: FinishedFlightPlanType | null | undefined,
  value: string
) {
  const filteredPoints = useMemo(
    () => filterWaarnemingenPoints(selectedPlan?.points_data, value),
    [value, selectedPlan?.points_data]
  );
  const filteredGeometries = useMemo(
    () => filterWaarnemingenGeometries(selectedPlan?.geometries, value),
    [value, selectedPlan?.geometries]
  );
  return { filteredPoints, filteredGeometries };
}
