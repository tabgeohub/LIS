import { QueryClient } from "@tanstack/react-query";
import { flightPlanKeys, templateFlightKeys } from "./queryKeys";

/**
 * Invalidate TanStack Query caches after mutations.
 * Keeps flight-plan lists in sync across all tabs.
 */
export function invalidateRelatedQueries(
  queryClient: QueryClient,
  path: string
): void {
  if (path.includes("/flightPlans")) {
    queryClient.invalidateQueries({ queryKey: flightPlanKeys.all });
  }

  if (path.includes("/templateFlight") || path.includes("/template_plans")) {
    queryClient.invalidateQueries({ queryKey: templateFlightKeys.all });
  }
}
