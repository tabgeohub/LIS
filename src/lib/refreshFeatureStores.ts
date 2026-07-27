import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { usePointsStore } from "hooks/features/usePointsStore";

function pathNeedsPointsRefresh(path: string): boolean {
  return (
    path.includes("/points") ||
    path.includes("/flightPlans/vluchtplans/points")
  );
}

async function refreshPointsIfLoaded(): Promise<void> {
  const { dbPoints, refetchPoints } = usePointsStore.getState();
  if (dbPoints.length > 0) {
    await refetchPoints();
  }
}

async function refreshGeometriesIfLoaded(): Promise<void> {
  const { dbGeometries, refetchGeometries } = useGeometriesStore.getState();
  if (dbGeometries.length > 0) {
    await refetchGeometries();
  }
}

export async function refreshFeatureStores(path: string): Promise<void> {
  if (pathNeedsPointsRefresh(path)) {
    await refreshPointsIfLoaded();
  }

  if (path.includes("/geometries")) {
    await refreshGeometriesIfLoaded();
  }
}
