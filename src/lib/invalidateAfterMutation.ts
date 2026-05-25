import { QueryClient } from "@tanstack/react-query";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { usePointsStore } from "hooks/features/usePointsStore";
import {
  constKeys,
  emailKeys,
  finishedPlanKeys,
  flightPlanKeys,
  geometryKeys,
  pointKeys,
  templateFlightKeys,
} from "./queryKeys";

function isFlightPlanQueryKey(key: unknown): key is readonly unknown[] {
  return Array.isArray(key) && key[0] === flightPlanKeys.all[0];
}

function invalidateFlightPlanQueries(
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

export function invalidateRelatedQueries(
  queryClient: QueryClient,
  path: string
): void {
  if (path.includes("/flightPlans")) {
    invalidateFlightPlanQueries(queryClient, path);
  }

  if (path.includes("/templateFlight") || path.includes("/template_plans")) {
    queryClient.invalidateQueries({ queryKey: templateFlightKeys.all });
  }

  if (path.includes("/points")) {
    queryClient.invalidateQueries({ queryKey: pointKeys.all });
  }

  if (path.includes("/finished_plans")) {
    queryClient.invalidateQueries({ queryKey: finishedPlanKeys.all });
  }

  if (path.includes("/geometries")) {
    queryClient.invalidateQueries({ queryKey: geometryKeys.all });
  }

  if (path.includes("/emails")) {
    queryClient.invalidateQueries({ queryKey: emailKeys.all });
  }

  if (path.includes("/consts")) {
    queryClient.invalidateQueries({ queryKey: constKeys.all });
  }
}

async function refreshFeatureStores(path: string): Promise<void> {
  const shouldRefreshPoints =
    path.includes("/points") ||
    path.includes("/flightPlans/vluchtplans/points");

  const shouldRefreshGeometries = path.includes("/geometries");

  if (shouldRefreshPoints) {
    const { dbPoints, refetchPoints } = usePointsStore.getState();
    if (dbPoints.length > 0) {
      await refetchPoints();
    }
  }

  if (shouldRefreshGeometries) {
    const { dbGeometries, refetchGeometries } = useGeometriesStore.getState();
    if (dbGeometries.length > 0) {
      await refetchGeometries();
    }
  }
}

/** Single entry point after create/update/delete — TanStack cache + map stores. */
export async function invalidateAfterMutation(
  queryClient: QueryClient,
  path: string
): Promise<void> {
  invalidateRelatedQueries(queryClient, path);
  await refreshFeatureStores(path);
}
