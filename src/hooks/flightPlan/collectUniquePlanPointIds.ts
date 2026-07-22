type GeometryWithPoints = {
  id: number;
  points?: { id?: number }[];
};

function collectPointIdsFromGeometry(geometry: GeometryWithPoints): number[] {
  const ids: number[] = [];
  for (const point of geometry.points ?? []) {
    if (point.id != null) ids.push(point.id);
  }
  return ids;
}

function isSelectedGeometry(
  geometry: GeometryWithPoints,
  geometryIds: number[]
): boolean {
  return geometryIds.includes(geometry.id);
}

function gatherGeometryPointIds(input: {
  geometryIds: number[];
  geometries: GeometryWithPoints[];
}): number[] {
  if (input.geometryIds.length === 0 || input.geometries.length === 0) {
    return [];
  }

  return input.geometries
    .filter((geometry) => isSelectedGeometry(geometry, input.geometryIds))
    .flatMap(collectPointIdsFromGeometry);
}

/** Merge direct point IDs with point IDs from selected geometries (deduped). */
export function collectUniquePlanPointIds(input: {
  pointIds: number[];
  geometryIds?: number[];
  geometries?: GeometryWithPoints[];
}): number[] {
  const geometryPointIds = gatherGeometryPointIds({
    geometryIds: input.geometryIds ?? [],
    geometries: input.geometries ?? [],
  });

  return Array.from(new Set([...input.pointIds, ...geometryPointIds]));
}
