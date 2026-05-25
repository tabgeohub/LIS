import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";

/** Plans awaiting preparation */
export function useUnPreparedPlans(
  regioId: string | number | undefined,
  userId: number | undefined
) {
  return useQuery({
    queryKey: flightPlanKeys.unPrepared(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/unPreparedPlans?regio_id=${regioId}`
      ),
    enabled: enabledForRegio(regioId, userId),
  });
}
