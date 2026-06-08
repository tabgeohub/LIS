import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "./regioQuery";

/** Pre-prepared plans (add points to plan flows) */
export function usePrepreparedFlightPlans(
  regioId: string | number | undefined,
  userId: number | undefined
) {
  return useQuery({
    queryKey: flightPlanKeys.preprepared(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        appendRegioQuery("/flightPlans/prepreparedFlightPlans", regioId)
      ),
    enabled: enabledForRegio(regioId, userId),
  });
}
