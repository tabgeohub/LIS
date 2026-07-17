import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { filterGeometriesByCriteria } from "./geometryFilterPredicates";

export function useFilterGeometries() {
  const { activityFilter, filterText } = usePointsFilterStore();
  const { dbGeometries } = useGeometriesStore();

  return function filterGeometries(
    herhalen: boolean,
    setFilteredGeometries: (value: Geometry[]) => void
  ) {
    setFilteredGeometries(
      filterGeometriesByCriteria(dbGeometries, {
        herhalen,
        activityFilter,
        filterText,
      })
    );
  };
}
