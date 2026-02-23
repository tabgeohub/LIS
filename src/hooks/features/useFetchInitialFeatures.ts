import { usePointsStore } from "./usePointsStore";
import { useGeometriesStore } from "./useGeometriesStore";

export function useFetchInitialFeatures() {
  const { fetchPoints } = usePointsStore();
  const { fetchGeometries } = useGeometriesStore();

  const fetchInitialFeatures = async (regio?: string | number) => {
    // Execute both fetches in parallel for better performance
    // This is typically called after mutations, so we want fresh data
    await Promise.all([
      fetchPoints({
        regio: regio,
      }),
      fetchGeometries({
        regio: regio,
      }),
    ]);
  };

  return { fetchInitialFeatures };
}

