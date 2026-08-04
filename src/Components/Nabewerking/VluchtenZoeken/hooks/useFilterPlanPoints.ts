/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { usePointsStore } from "hooks/features";
import { useFinishedPlansState } from "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState";
import { filterPointsForPlan } from "Components/HomePage/hooks/filters/filterPlanPoints";

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

