import { useMemo, useState } from "react";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import { useFilterPlans } from "hooks/filters/useFilterPlans";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import {
  useRemoveFlightPlanFilterEffects,
  visibleRemovePlans,
} from "./removeFlightPlanFilterEffects";

export function useRemoveFlightPlanModel() {
  const store = useDeleteFlightPlan();
  const [showAllPlans, setShowAllPlans] = useState(false);
  const filterPlans = useFilterPlans();
  const { user } = useAuth();
  const query = useFlightPlansList({
    regioId: user.role,
    userId: user.user_id,
  });
  const plans = query.data ?? EMPTY_FLIGHT_PLANS;

  useRemoveFlightPlanFilterEffects({
    plans,
    filterTerm: store.filterTerm,
    setFilteredPlans: store.setFilteredPlans,
    setFilterTerm: store.setFilterTerm,
    filterPlans,
  });

  const allPlans = useMemo(
    () => visibleRemovePlans(plans, showAllPlans),
    [plans, showAllPlans]
  );

  return {
    setFilterTerm: store.setFilterTerm,
    openFilter: store.openFilter,
    showAllPlans,
    setShowAllPlans,
    plans,
    loading: query.isPending,
    allPlans,
    refetch: () => {
      if (user.user_id === undefined || user.user_id === 0) return;
      query.refetch();
    },
  };
}
