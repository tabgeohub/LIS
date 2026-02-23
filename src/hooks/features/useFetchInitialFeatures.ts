import { usePointsStore } from "./usePointsStore";
import { useGeometriesStore } from "./useGeometriesStore";

export function useFetchInitialFeatures() {
  const { fetchPoints } = usePointsStore();
  const { fetchGeometries } = useGeometriesStore();

  const fetchInitialFeatures = async (regio?: string | number) => {
    // Only fetch once per resource type - each function now populates both stores
    await fetchPoints({
      regio: regio,
    });

    await fetchGeometries({
      regio: regio,
    });
  };

  return { fetchInitialFeatures };
}

