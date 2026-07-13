type GeometryWithPoints = {
  id: number;
  points?: { id?: number }[];
};

/** Merge direct point IDs with point IDs from selected geometries (deduped). */
export function collectUniquePlanPointIds(input: {
  pointIds: number[];
  geometryIds?: number[];
  geometries?: GeometryWithPoints[];
}): number[] {
  const geometryPointIds: number[] = [];
  const geometryIds = input.geometryIds ?? [];
  const geometries = input.geometries ?? [];

  if (geometryIds.length > 0 && geometries.length > 0) {
    geometries
      .filter((geometry) => geometryIds.includes(geometry.id))
      .forEach((geometry) => {
        geometry.points?.forEach((point) => {
          if (point.id != null) geometryPointIds.push(point.id);
        });
      });
  }

  return Array.from(new Set([...input.pointIds, ...geometryPointIds]));
}
