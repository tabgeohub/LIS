import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForRegio } from "./enabled";
import { appendRegioQuery } from "./regioQuery";

/** Plans awaiting preparation */
export function useUnPreparedPlans(
  regioId: string | number | undefined,
  userId: number | undefined
) {
  return useQuery({
    queryKey: flightPlanKeys.unPrepared(regioId ?? ""),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        appendRegioQuery("/flightPlans/unPreparedPlans", regioId)
      ),
    enabled: enabledForRegio(regioId, userId),
  });
}
