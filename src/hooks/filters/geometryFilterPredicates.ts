import { Geometry } from "hooks/features/useGeometriesStore";

export type GeometryFilterCriteria = {
  herhalen: boolean;
  activityFilter: string;
  filterText: string;
};

function geometryHerhalenValue(geometry: Geometry): number {
  if (typeof geometry.herhalen === "number") return geometry.herhalen;
  if (typeof geometry.herhalen === "string") return Number(geometry.herhalen);
  return geometry.herhalen === true ? 1 : 0;
}

export function matchesGeometryFilters(
  geometry: Geometry,
  criteria: GeometryFilterCriteria
): boolean {
  const herhalenFilter = criteria.herhalen ? 1 : 0;
  if (geometryHerhalenValue(geometry) !== herhalenFilter) return false;

  if (
    criteria.activityFilter &&
    criteria.activityFilter !== "" &&
    geometry.activiteit !== criteria.activityFilter
  ) {
    return false;
  }

  if (
    criteria.filterText &&
    criteria.filterText.trim() !== "" &&
    !(geometry.omschrijving || "")
      .toLowerCase()
      .includes(criteria.filterText.toLowerCase())
  ) {
    return false;
  }

  return true;
}

export function filterGeometriesByCriteria(
  geometries: Geometry[],
  criteria: GeometryFilterCriteria
): Geometry[] {
  return geometries.filter((geometry) =>
    matchesGeometryFilters(geometry, criteria)
  );
}
