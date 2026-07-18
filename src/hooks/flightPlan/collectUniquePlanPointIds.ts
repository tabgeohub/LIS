type GeometryWithPoints = {
  id: number;
  points?: { id?: number }[];
};

function gatherGeometryPointIds(input: {
  geometryIds: number[];
  geometries: GeometryWithPoints[];
}): number[] {
  if (input.geometryIds.length === 0 || input.geometries.length === 0) {
    return [];
  }

  const geometryPointIds: number[] = [];
  for (const geometry of input.geometries) {
    if (!input.geometryIds.includes(geometry.id)) continue;
    for (const point of geometry.points ?? []) {
      if (point.id != null) geometryPointIds.push(point.id);
    }
  }
  return geometryPointIds;
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
