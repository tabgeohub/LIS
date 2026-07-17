import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { fetchApi } from "api/fetchApi";

export function searchedFlightPlansQuery(debounced: string) {
  return {
    queryKey: flightPlanKeys.searched(debounced),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/searchedFlightplan?search=${debounced}`
      ),
    enabled: debounced.length > 0,
  };
}

export function vluchtnummerExistsQuery(debounced: string, enabled: boolean) {
  return {
    queryKey: flightPlanKeys.vluchtnummer(debounced),
    queryFn: () =>
      fetchApi<number>(`/flightPlans/vluchtnummer/${debounced}`),
    enabled: enabled && debounced.length > 0,
  };
}

export function pointFlightPlansQuery(pointId: number | undefined) {
  return {
    queryKey: flightPlanKeys.byPoint(pointId ?? 0),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(`/points/flightPlans/${pointId}`),
    enabled: pointId !== undefined && pointId > 0,
  };
}
