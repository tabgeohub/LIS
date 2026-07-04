import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { useDebouncedValue } from "utils/useDebouncedValue";
import { finishedPlanKeys, emailKeys } from "lib/queryKeys";
import { pointKeys } from "lib/queryKeys";
import { FinishedFlightPlanType, AttachmentType } from "Types/finished_plans";
import { EnrichedPointType } from "Types";
import { EmailType } from "Types";
import { appendRegioQuery } from "./flightPlans/regioQuery";
import { POINT_DEBOUNCE_MS } from "./points/constants";
import { PlanPathRow } from "./finishedPlans/types";

export function usePartialFinishedPlans(regioId: string | number | undefined) {
  return useQuery({
    queryKey: finishedPlanKeys.partialList(regioId ?? ""),
    queryFn: () =>
      fetchApi<FinishedFlightPlanType[]>(
        appendRegioQuery(
          "/finished_plans/getPartialFinishedFlightPlans",
          regioId
        )
      ),
    enabled: regioId !== undefined && regioId !== "",
  });
}

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

export function usePlanPointAttachments(input: {
  planId: number | undefined;
  pointId: number | undefined;
  isFinished: boolean;
}) {
  const { planId, pointId, isFinished } = input;
  return useQuery({
    queryKey: finishedPlanKeys.attachments(planId ?? 0, pointId ?? 0),
    queryFn: () =>
      fetchApi<AttachmentType[]>(
        `/finished_plans/getAttachmentsPlanSinglePoint?planId=${planId}&pointId=${pointId}`
      ),
    enabled:
      isFinished &&
      planId !== undefined &&
      planId > 0 &&
      pointId !== undefined &&
      pointId > 0,
  });
}

export function useSearchedPoints(search: string) {
  const debouncedSearch = useDebouncedValue(search, POINT_DEBOUNCE_MS);
  return useQuery({
    queryKey: pointKeys.searched(debouncedSearch),
    queryFn: () =>
      fetchApi<EnrichedPointType[]>(`/points/searchedPoints/${debouncedSearch}`),
    enabled: debouncedSearch.length > 0,
  });
}

export function useDuplicateOmschrijvingCount(omschrijving: string) {
  const debounced = useDebouncedValue(omschrijving, POINT_DEBOUNCE_MS);
  return useQuery({
    queryKey: pointKeys.duplicateOmschrijving(debounced),
    queryFn: () => fetchApi<number>(`/points/duplicatePoints/${debounced}`),
    enabled: debounced.length > 0,
  });
}

export function useEmailsList() {
  return useQuery({
    queryKey: emailKeys.list(),
    queryFn: () => fetchApi<EmailType[]>("/emails"),
  });
}
