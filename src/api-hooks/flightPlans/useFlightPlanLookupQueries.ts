import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "hooks/shared/useDebouncedValue";
import { FLIGHT_PLAN_DEBOUNCE_MS } from "./constants";
import {
  pointFlightPlansQuery,
  searchedFlightPlansQuery,
  vluchtnummerExistsQuery,
} from "./flightPlanLookupQueryDefs";

export function useSearchedFlightPlans(search: string) {
  const debounced = useDebouncedValue(search, FLIGHT_PLAN_DEBOUNCE_MS);
  return useQuery(searchedFlightPlansQuery(debounced));
}

export function useVluchtnummerExists(vluchtnummer: string, enabled = true) {
  const debounced = useDebouncedValue(vluchtnummer, FLIGHT_PLAN_DEBOUNCE_MS);
  return useQuery(vluchtnummerExistsQuery(debounced, enabled));
}

export function usePointFlightPlans(pointId: number | undefined) {
  return useQuery(pointFlightPlansQuery(pointId));
}
