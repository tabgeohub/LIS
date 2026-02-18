import { usePointsStore } from "./usePointsStore";
import { useGeometriesStore } from "./useGeometriesStore";

export function useResetFeatures() {
  const { dbPoints, setPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();

  const resetFeatures = () => {
    setPoints(dbPoints);
    // Only reset geometries if dbGeometries has data, otherwise preserve current state
    if (dbGeometries && dbGeometries.length > 0) {
      setGeometries(dbGeometries);
    }
  };

  return { resetFeatures };
}

