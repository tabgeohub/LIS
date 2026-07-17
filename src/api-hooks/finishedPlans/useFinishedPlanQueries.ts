import { useQuery } from "@tanstack/react-query";
import {
  finishedPlanPathQuery,
  partialFinishedPlansQuery,
  singleFinishedPlanQuery,
} from "./finishedPlanQueryConfig";

export function usePartialFinishedPlans(regioId: string | number | undefined) {
  return useQuery(partialFinishedPlansQuery(regioId));
}

export function useSingleFinishedPlan(planId: number | undefined) {
  return useQuery(singleFinishedPlanQuery(planId));
}

export function useFinishedPlanPath(planId: number | undefined) {
  return useQuery(finishedPlanPathQuery(planId));
}
