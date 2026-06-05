import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { useDebouncedValue } from "utils/useDebouncedValue";
import { flightPlanKeys } from "lib/queryKeys";
import { FlightPlanType } from "Types";
import { FLIGHT_PLAN_DEBOUNCE_MS } from "./constants";

/** Search results for flight plans */
export function useSearchedFlightPlans(search: string) {
  const debouncedSearch = useDebouncedValue(search, FLIGHT_PLAN_DEBOUNCE_MS);

  return useQuery({
    queryKey: flightPlanKeys.searched(debouncedSearch),
    queryFn: () =>
      fetchApi<FlightPlanType[]>(
        `/flightPlans/searchedFlightplan?search=${debouncedSearch}`
      ),
    enabled: debouncedSearch.length > 0,
  });
}
