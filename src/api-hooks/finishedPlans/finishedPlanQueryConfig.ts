import { fetchApi } from "api-hooks/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { appendRegioQuery } from "../shared/regioQuery";
import { PlanPathRow } from "./types";

export function partialFinishedPlansQuery(regioId: string | number | undefined) {
  return {
    queryKey: finishedPlanKeys.partialList(regioId ?? ""),
    queryFn: () =>
      fetchApi<FinishedFlightPlanType[]>(
        appendRegioQuery("/finished_plans/getPartialFinishedFlightPlans", regioId)
      ),
    enabled: regioId !== undefined && regioId !== "",
  };
}

export function singleFinishedPlanQuery(planId: number | undefined) {
  return {
    queryKey: finishedPlanKeys.single(planId ?? 0),
    queryFn: () =>
      fetchApi<FinishedFlightPlanType>(
        `/finished_plans/getSingleFinishedFlightPlan/${planId}`
      ),
    enabled: planId !== undefined && planId > 0,
  };
}

export function finishedPlanPathQuery(planId: number | undefined) {
  return {
    queryKey: finishedPlanKeys.planPath(planId ?? 0),
    queryFn: () =>
      fetchApi<PlanPathRow[] | PlanPathRow>(
        `/finished_plans/getPlanPath/${planId}`
      ),
    enabled: planId !== undefined && planId > 0,
  };
}
