import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { FinishedFlightPlanType } from "Types/finished_plans";

export function useSingleFinishedPlan(planId: number | undefined) {
  return useQuery({
    queryKey: finishedPlanKeys.single(planId ?? 0),
    queryFn: () =>
      fetchApi<FinishedFlightPlanType>(
        `/finished_plans/getSingleFinishedFlightPlan/${planId}`
      ),
    enabled: planId !== undefined && planId > 0,
  });
}
