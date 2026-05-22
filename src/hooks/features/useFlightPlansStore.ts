/**
 * @deprecated Use `useFlightPlansList` from `hooks/queries/useFlightPlanQueries` instead.
 * This module is kept temporarily for any remaining imports during migration.
 */
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useFlightPlansList } from "hooks/queries/useFlightPlanQueries";

export function useFlightPlansStore() {
  const { user } = useAuth();
  const { data, isPending, refetch } = useFlightPlansList(
    user.role,
    user.user_id
  );

  const flightPlans = data ?? EMPTY_FLIGHT_PLANS;

  return {
    flightPlans,
    fetchFlightPlans: async (_regio_id: string | number) => {
      await refetch();
    },
    refetchFlightPlans: async (_regio_id: string | number) => {
      await refetch();
    },
    setFlightPlans: () => {
      console.warn(
        "useFlightPlansStore.setFlightPlans is deprecated; update via TanStack Query mutations."
      );
    },
    clearFlightPlans: () => {
      console.warn(
        "useFlightPlansStore.clearFlightPlans is deprecated; use queryClient.invalidateQueries."
      );
    },
    /** @deprecated use isPending from useFlightPlansList */
    loading: isPending,
  };
}
