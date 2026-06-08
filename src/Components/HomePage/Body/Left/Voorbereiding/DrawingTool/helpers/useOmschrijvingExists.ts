import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useMemo } from "react";

export function useOmschrijvingExists(omschrijving: string) {
  const { dbGeometries } = useGeometriesStore();

  return useMemo(() => {
    if (!omschrijving || omschrijving.trim() === "") return false;

    return dbGeometries.some(
      (geometry) =>
        geometry.omschrijving?.toLowerCase().trim() ===
        omschrijving.toLowerCase().trim()
    );
  }, [omschrijving, dbGeometries]);
}
