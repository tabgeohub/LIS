import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { appendRegioQuery } from "../flightPlans/regioQuery";

export function usePartialFinishedPlans(
  regioId: string | number | undefined
) {
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
