import { useAuth } from "hooks/zustand/ui";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";

export function useRemoveFlightPlanQuery() {
  const { user } = useAuth();
  const query = useFlightPlansList({
    regioId: user.role,
    userId: user.user_id,
  });
  return {
    plans: query.data ?? EMPTY_FLIGHT_PLANS,
    loading: query.isPending,
    refetch: () => {
      if (user.user_id === undefined || user.user_id === 0) return;
      query.refetch();
    },
  };
}
