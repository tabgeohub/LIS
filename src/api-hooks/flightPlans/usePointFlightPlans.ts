import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";

/** Flight plans linked to a point */
export function usePointFlightPlans(pointId: number | undefined) {
  return useQuery({
    queryKey: flightPlanKeys.byPoint(pointId ?? 0),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(`/points/flightPlans/${pointId}`),
    enabled: pointId !== undefined && pointId > 0,
  });
}
