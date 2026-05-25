import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";

/** Fully prepared plans (nabewerking status change) */
export function useFullPreparedFlightPlans(
  regioId: string | number | undefined,
  userId: number | undefined
) {
  return useQuery({
    queryKey: flightPlanKeys.fullPrepared(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/fullPreparedFlightPlans?regio_id=${regioId}`
      ),
    enabled: enabledForRegio(regioId, userId),
  });
}
