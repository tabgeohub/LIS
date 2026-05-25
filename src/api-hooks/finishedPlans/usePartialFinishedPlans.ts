import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { FinishedFlightPlanType } from "Types/finished_plans";

export function usePartialFinishedPlans(
  regioId: string | number | undefined
) {
  return useQuery({
    queryKey: finishedPlanKeys.partialList(regioId ?? ""),
    queryFn: () =>
      fetchApi<FinishedFlightPlanType[]>(
        `/finished_plans/getPartialFinishedFlightPlans?regio_id=${regioId}`
      ),
    enabled: regioId !== undefined && regioId !== "",
  });
}
