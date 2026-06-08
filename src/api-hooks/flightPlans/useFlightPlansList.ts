import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "./regioQuery";

/** All flight plans for a region (ViewPlan, Remove, Reuse, etc.) */
export function useFlightPlansList(
  regioId: string | number | undefined,
  userId: number | undefined,
  queryEnabled = true
) {
  return useQuery({
    queryKey: flightPlanKeys.list(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(appendRegioQuery("/flightPlans", regioId)),
    enabled: queryEnabled && enabledForRegio(regioId, userId),
  });
}
