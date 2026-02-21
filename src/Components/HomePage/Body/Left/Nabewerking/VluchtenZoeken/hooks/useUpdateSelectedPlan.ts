/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";

/**
 * Hook to update selected plan when finished plan data is fetched
 */
export function useUpdateSelectedPlan(finishedPlan: FinishedFlightPlanType | null | undefined) {
  const { setSelectedPlan } = useFinishedPlansState();

  useEffect(() => {
    if (!finishedPlan) return;

    setSelectedPlan(finishedPlan);
  }, [finishedPlan]);
}

