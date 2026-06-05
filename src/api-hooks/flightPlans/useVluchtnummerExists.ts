import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { useDebouncedValue } from "utils/useDebouncedValue";
import { flightPlanKeys } from "lib/queryKeys";
import { FLIGHT_PLAN_DEBOUNCE_MS } from "./constants";

/** Check if vluchtnummer already exists (returns count) */
export function useVluchtnummerExists(
  vluchtnummer: string,
  enabled = true
) {
  const debouncedVluchtnummer = useDebouncedValue(
    vluchtnummer,
    FLIGHT_PLAN_DEBOUNCE_MS
  );

  return useQuery({
    queryKey: flightPlanKeys.vluchtnummer(debouncedVluchtnummer),
    queryFn: () =>
      fetchApi<number>(`/flightPlans/vluchtnummer/${debouncedVluchtnummer}`),
    enabled: enabled && debouncedVluchtnummer.length > 0,
  });
}
