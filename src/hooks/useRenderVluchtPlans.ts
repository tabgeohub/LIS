/* eslint-disable react-hooks/exhaustive-deps */
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { useEffect, useRef } from "react";
import { FlightPlanType } from "Types";

export function useRenderVluchtplans(plans: FlightPlanType[]) {
  const setInitialPlans = useViewPlanState((s) => s.setInitialPlans);
  const syncedRef = useRef<FlightPlanType[] | null>(null);

  useEffect(() => {
    if (!plans) return;
    // React Query returns a new array reference after refetch — do not compare by id only
    if (syncedRef.current === plans) return;

    syncedRef.current = plans;
    setInitialPlans(plans);
  }, [plans, setInitialPlans]);
}
