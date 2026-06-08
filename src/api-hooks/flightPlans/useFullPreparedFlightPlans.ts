import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "./regioQuery";

/** Fully prepared plans (nabewerking status change) */
export function useFullPreparedFlightPlans(
  regioId: string | number | undefined,
  userId: number | undefined
) {
  return useQuery({
    queryKey: flightPlanKeys.fullPrepared(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        appendRegioQuery("/flightPlans/fullPreparedFlightPlans", regioId)
      ),
    enabled: enabledForRegio(regioId, userId),
  });
}
