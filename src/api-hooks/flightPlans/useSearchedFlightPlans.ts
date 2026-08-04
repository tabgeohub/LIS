import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "lib/useDebouncedValue";
import { FLIGHT_PLAN_DEBOUNCE_MS } from "./constants";
import { searchedFlightPlansQuery } from "./flightPlanLookupQueryDefs";

export function useSearchedFlightPlans(search: string) {
  const debounced = useDebouncedValue(search, FLIGHT_PLAN_DEBOUNCE_MS);
  return useQuery(searchedFlightPlansQuery(debounced));
}
