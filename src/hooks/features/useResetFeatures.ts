import { usePointsStore } from "./usePointsStore";
import { useGeometriesStore } from "./useGeometriesStore";

export function useResetFeatures() {
  const { dbPoints, setPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();

  const resetFeatures = () => {
    setPoints(dbPoints);
    // Always reset geometries to dbGeometries (even if empty, to clear filtered state)
    setGeometries(dbGeometries || []);
  };

  return { resetFeatures };
}

