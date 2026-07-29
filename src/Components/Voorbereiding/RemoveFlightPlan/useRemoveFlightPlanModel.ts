import { useMemo, useState } from "react";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import { useFilterPlans } from "Components/HomePage/hooks/filters/useFilterPlans";
import {
  useRemoveFlightPlanFilterEffects,
  visibleRemovePlans,
} from "./removeFlightPlanFilterEffects";
import { useRemoveFlightPlanQuery } from "./useRemoveFlightPlanQuery";

export function useRemoveFlightPlanModel() {
  const store = useDeleteFlightPlan();
  const [showAllPlans, setShowAllPlans] = useState(false);
  const filterPlans = useFilterPlans();
  const { plans, loading, refetch } = useRemoveFlightPlanQuery();

  useRemoveFlightPlanFilterEffects({
    plans,
    filterTerm: store.filterTerm,
    setFilteredPlans: store.setFilteredPlans,
    setFilterTerm: store.setFilterTerm,
    filterPlans,
  });

  const allPlans = useMemo(
    () => visibleRemovePlans({ plans, showAllPlans }),
    [plans, showAllPlans]
  );

  return {
    setFilterTerm: store.setFilterTerm,
    openFilter: store.openFilter,
    showAllPlans,
    setShowAllPlans,
    plans,
    loading,
    allPlans,
    refetch,
  };
}
