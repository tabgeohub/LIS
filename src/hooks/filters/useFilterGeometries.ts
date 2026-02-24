import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";

export function useFilterGeometries() {
  const { activityFilter, periodFilter, dateFrom, dateTo, filterText } =
    usePointsFilterStore();

  const { dbGeometries } = useGeometriesStore();

  function filterGeometries(
    herhalen: boolean,
    setFilteredGeometries: (value: Geometry[]) => void
  ) {
    const herhalenFilter = herhalen ? 1 : 0;

    const filteredGeometries = dbGeometries.filter((geometry) => {
      // Filter by herhalen
      const geometryHerhalen =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen
          : typeof geometry.herhalen === "string"
            ? Number(geometry.herhalen)
            : geometry.herhalen === true
              ? 1
              : 0;

      if (geometryHerhalen !== herhalenFilter) {
        return false;
      }

      // Filter by activity
      if (
        activityFilter &&
        activityFilter !== "" &&
        geometry.activiteit !== activityFilter
      ) {
        return false;
      }

      // Note: Geometries might not have created_at, so we skip period filtering for now
      // If needed, we can add it later when geometries have date fields

      // Filter by text search
      if (
        filterText &&
        filterText.trim() !== "" &&
        !(geometry.omschrijving || "")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    setFilteredGeometries(filteredGeometries);
  }

  return filterGeometries;
}

