/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";

/**
 * Hook to filter points store to only include points from the selected plan
 */
export function useFilterPlanPoints() {
  const { selectedPlan } = useFinishedPlansState();
  const { points, setPoints } = usePointsStore();

  useEffect(() => {
    const planPointsIds = selectedPlan?.points_data.flatMap(
      (point) => point.id
    );

    const filteredPoints = points.filter((point) =>
      planPointsIds?.includes(point.id)
    );

    setPoints(filteredPoints);
  }, [selectedPlan?.points_data]);
}

