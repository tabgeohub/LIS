import { useAuth } from "hooks/zustand/ui/useAuth";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import { useTemplateFlights } from "api-hooks/templateFlights";

type Source = "flightPlans" | "templates";

export function useSelectFromSourceQuery(source: Source) {
  const { user } = useAuth();
  const { data: flightPlansData, isPending: flightPlansPending } =
    useFlightPlansList({
      regioId: user.role,
      userId: user.user_id,
      enabled: source === "flightPlans",
    });
  const { data: templateData, isPending: templatePending } = useTemplateFlights({
    regioId: user.role,
    userId: user.user_id,
    enabled: source === "templates",
  });

  return {
    data:
      source === "flightPlans"
        ? flightPlansData ?? EMPTY_FLIGHT_PLANS
        : templateData,
    dataLoading:
      source === "flightPlans" ? flightPlansPending : templatePending,
  };
}
