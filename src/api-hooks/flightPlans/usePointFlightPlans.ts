import { useQuery } from "@tanstack/react-query";
import { pointFlightPlansQuery } from "./flightPlanLookupQueryDefs";

export function usePointFlightPlans(pointId: number | undefined) {
  return useQuery(pointFlightPlansQuery(pointId));
}
