/* eslint-disable react-hooks/exhaustive-deps */
import { useViewPlanState } from "Components/HomePage/Body/Left/Voorbereiding/ViewPlan/helpers/useViewPlanState";
import { useEffect, useRef } from "react";
import { FlightPlanType } from "Types";

function plansEqual(a: FlightPlanType[], b: FlightPlanType[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((p, i) => p.id === b[i]?.id);
}

export function useRenderVluchtplans(plans: FlightPlanType[]) {
  const setInitialPlans = useViewPlanState((s) => s.setInitialPlans);
  const syncedRef = useRef<FlightPlanType[] | null>(null);

  useEffect(() => {
    if (!plans) return;
    if (syncedRef.current && plansEqual(syncedRef.current, plans)) return;

    syncedRef.current = plans;
    setInitialPlans(plans);
  }, [plans, setInitialPlans]);
}
