import { usePointsStore } from "./usePointsStore";
import { useGeometriesStore } from "./useGeometriesStore";

export function useFetchInitialFeatures() {
  const { fetchDBPoints, fetchPoints } = usePointsStore();
  const { fetchDBGeometries, fetchGeometries } = useGeometriesStore();

  const fetchInitialFeatures = async (regio?: string | number) => {
    await fetchDBPoints({
      regio: regio,
    });

    await fetchPoints({
      regio: regio,
    });

    await fetchDBGeometries({
      regio: regio,
    });

    await fetchGeometries({
      regio: regio,
    });
  };

  return { fetchInitialFeatures };
}

