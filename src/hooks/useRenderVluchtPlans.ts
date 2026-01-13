/* eslint-disable react-hooks/exhaustive-deps */
import { useViewPlanState } from "Components/HomePage/Body/Left/Voorbereiding/ViewPlan/helpers/useViewPlanState";
import { useEffect } from "react";
import { FlightPlanType } from "Types";

export function useRenderVluchtplans(plans: FlightPlanType[]) {
  const { setInitialPlans } = useViewPlanState();

  useEffect(() => {
    if (!plans) return;

    setInitialPlans(plans);
  }, [plans]);
}
