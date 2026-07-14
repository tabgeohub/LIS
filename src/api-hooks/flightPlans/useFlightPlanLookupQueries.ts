import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { useDebouncedValue } from "utils/useDebouncedValue";
import { FLIGHT_PLAN_DEBOUNCE_MS } from "./constants";

export function useSearchedFlightPlans(search: string) {
  const debounced = useDebouncedValue(search, FLIGHT_PLAN_DEBOUNCE_MS);
  return useQuery({
    queryKey: flightPlanKeys.searched(debounced),
    queryFn: () => fetchApi<FlightPlanType[]>(`/flightPlans/searchedFlightplan?search=${debounced}`),
    enabled: debounced.length > 0,
  });
}

export function useVluchtnummerExists(vluchtnummer: string, enabled = true) {
  const debounced = useDebouncedValue(vluchtnummer, FLIGHT_PLAN_DEBOUNCE_MS);
  return useQuery({
    queryKey: flightPlanKeys.vluchtnummer(debounced),
    queryFn: () => fetchApi<number>(`/flightPlans/vluchtnummer/${debounced}`),
    enabled: enabled && debounced.length > 0,
  });
}

export function usePointFlightPlans(pointId: number | undefined) {
  return useQuery({
    queryKey: flightPlanKeys.byPoint(pointId ?? 0),
    queryFn: () => fetchApi<FlightPlanType[]>(`/points/flightPlans/${pointId}`),
    enabled: pointId !== undefined && pointId > 0,
  });
}
