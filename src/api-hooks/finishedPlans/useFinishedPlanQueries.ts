import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { appendRegioQuery } from "../flightPlans/regioQuery";
import { PlanPathRow } from "./types";

export function usePartialFinishedPlans(regioId: string | number | undefined) {
  return useQuery({
    queryKey: finishedPlanKeys.partialList(regioId ?? ""),
    queryFn: () => fetchApi<FinishedFlightPlanType[]>(appendRegioQuery("/finished_plans/getPartialFinishedFlightPlans", regioId)),
    enabled: regioId !== undefined && regioId !== "",
  });
}

export function useSingleFinishedPlan(planId: number | undefined) {
  return useQuery({
    queryKey: finishedPlanKeys.single(planId ?? 0),
    queryFn: () => fetchApi<FinishedFlightPlanType>(`/finished_plans/getSingleFinishedFlightPlan/${planId}`),
    enabled: planId !== undefined && planId > 0,
  });
}

export function useFinishedPlanPath(planId: number | undefined) {
  return useQuery({
    queryKey: finishedPlanKeys.planPath(planId ?? 0),
    queryFn: () => fetchApi<PlanPathRow[] | PlanPathRow>(`/finished_plans/getPlanPath/${planId}`),
    enabled: planId !== undefined && planId > 0,
  });
}
