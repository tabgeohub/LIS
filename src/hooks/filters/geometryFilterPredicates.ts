import { Geometry } from "hooks/features";

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

function matchesActivityFilter(
  geometry: Geometry,
  activityFilter: string
): boolean {
  if (!activityFilter) return true;
  return geometry.activiteit === activityFilter;
}

function matchesTextFilter(geometry: Geometry, filterText: string): boolean {
  const needle = filterText.trim().toLowerCase();
  if (!needle) return true;
  return (geometry.omschrijving || "").toLowerCase().includes(needle);
}

export function matchesGeometryFilters(
  geometry: Geometry,
  criteria: GeometryFilterCriteria
): boolean {
  const herhalenFilter = criteria.herhalen ? 1 : 0;
  if (geometryHerhalenValue(geometry) !== herhalenFilter) return false;
  if (!matchesActivityFilter(geometry, criteria.activityFilter)) return false;
  return matchesTextFilter(geometry, criteria.filterText);
}

export function filterGeometriesByCriteria(
  geometries: Geometry[],
  criteria: GeometryFilterCriteria
): Geometry[] {
  return geometries.filter((geometry) =>
    matchesGeometryFilters(geometry, criteria)
  );
}
