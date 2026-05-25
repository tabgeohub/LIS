import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { PlanPathRow } from "./types";

export function useFinishedPlanPath(planId: number | undefined) {
  return useQuery({
    queryKey: finishedPlanKeys.planPath(planId ?? 0),
    queryFn: () =>
      fetchApi<PlanPathRow[] | PlanPathRow>(
        `/finished_plans/getPlanPath/${planId}`
      ),
    enabled: planId !== undefined && planId > 0,
  });
}
