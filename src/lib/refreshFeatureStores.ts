import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { usePointsStore } from "hooks/features/usePointsStore";

export async function refreshFeatureStores(path: string): Promise<void> {
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
