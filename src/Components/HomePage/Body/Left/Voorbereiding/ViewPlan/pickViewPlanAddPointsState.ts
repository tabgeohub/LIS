import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";

/** Shared ViewPlan slice used by AddPointToPlan + SelectFromSource button bars. */
export function useViewPlanAddPointsState() {
  const {
    selectedPlan,
    setSelectedPlan,
    setStep,
    filteredPlans,
    setFilteredPlans,
  } = useViewPlanState();

  return {
    selectedPlan,
    setSelectedPlan,
    setStep,
    filteredPlans,
    setFilteredPlans,
  };
}
