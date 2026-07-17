import { QueryClient } from "@tanstack/react-query";
import { flightPlanKeys } from "./queryKeys";

function isFlightPlanQueryKey(key: unknown): key is readonly unknown[] {
  return Array.isArray(key) && key[0] === flightPlanKeys.all[0];
}

export function invalidateFlightPlanQueries(
  queryClient: QueryClient,
  path: string
): void {
  if (path.includes("/vluchtplans/points")) {
    queryClient.invalidateQueries({
      predicate: (query) => {
        if (!isFlightPlanQueryKey(query.queryKey)) return false;
        const segment = String(query.queryKey[1]);
        return ["list", "unPrepared", "preprepared", "point"].includes(segment);
      },
    });
    return;
  }

  if (path.includes("updateFlightPlanStatus")) {
    queryClient.invalidateQueries({
      predicate: (query) => {
        if (!isFlightPlanQueryKey(query.queryKey)) return false;
        const segment = String(query.queryKey[1]);
        return ["list", "unPrepared", "preprepared", "fullPrepared"].includes(
          segment
        );
      },
    });
    return;
  }

  queryClient.invalidateQueries({
    predicate: (query) => {
      if (!isFlightPlanQueryKey(query.queryKey)) return false;
      return query.queryKey[1] !== "vluchtnummer";
    },
  });
}
