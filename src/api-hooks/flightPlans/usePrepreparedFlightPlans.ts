import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { enabledForUser } from "./enabled";

/** Pre-prepared plans (add points to plan flows) */
export function usePrepreparedFlightPlans(userId: number | undefined) {
  return useQuery({
    queryKey: flightPlanKeys.preprepared(),
    queryFn: () =>
      fetchApi<FlightPlanType[]>("/flightPlans/prepreparedFlightPlans"),
    enabled: enabledForUser(userId),
  });
}
