/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { filterPointsForPlan } from "hooks/filters/filterPlanPoints";

/**
 * Hook to filter points store to only include points from the selected plan
 */
export function useFilterPlanPoints() {
  const { selectedPlan } = useFinishedPlansState();
  const { points, setPoints } = usePointsStore();

  useEffect(() => {
    setPoints(filterPointsForPlan(points, selectedPlan));
  }, [selectedPlan?.points_data]);
}

