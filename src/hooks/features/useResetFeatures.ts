import { usePointsStore } from "./usePointsStore";
import { useGeometriesStore } from "./useGeometriesStore";

export function useResetFeatures() {
  const { dbPoints, setPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();

  const resetFeatures = () => {
    // Create new array references to ensure Zustand detects the change
    setPoints(dbPoints ? [...dbPoints] : []);
    // Always reset geometries to dbGeometries (even if empty, to clear filtered state)
    // Create new array reference to ensure Zustand detects the change
    setGeometries(dbGeometries ? [...dbGeometries] : []);
  };

  return { resetFeatures };
}

