import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useRenderVluchtplans } from "hooks/useRenderVluchtPlans";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import { useViewPlanFilteredPlans } from "./useViewPlanFilteredPlans";

export function useViewPlanController() {
  const { user } = useAuth();
  const state = useViewPlanState();
  const { data, isPending, refetch: refetchFlightPlans } = useFlightPlansList({
    regioId: user.role,
    userId: user.user_id,
  });
  const flightPlans = data ?? EMPTY_FLIGHT_PLANS;

  useRenderVluchtplans(flightPlans);
  useViewPlanFilteredPlans({
    initialPlans: state.initialPlans,
    flightPlans,
    filterInput: state.filterInput,
    dateVan: state.dateVan,
    dateTot: state.dateTot,
    setFilteredPlans: state.setFilteredPlans,
    setFilterInput: state.setFilterInput,
  });

  return {
    initialPlans: state.initialPlans,
    step: state.step,
    openFilter: state.openFilter,
    loading: isPending,
    refetch: () => {
      if (user.user_id === undefined || user.user_id === 0) return;
      refetchFlightPlans();
    },
  };
}
