import { Geometry } from "hooks/features/useGeometriesStore";

/** All point IDs for create: standalone points + vertices of selected geometries. */
export function buildReuseFlightPlanPointIds(
  currentPoints: number[],
  newPoints: number[],
  currentGeometryIds: number[],
  newGeometryIds: number[],
  dbGeometries: Geometry[],
  planGeometries: Geometry[] = []
): number[] {
  const selectedGeometryIds = new Set([
    ...currentGeometryIds,
    ...newGeometryIds,
  ]);

  const geometryPointIds: number[] = [];

  const addVertices = (geometry: Geometry) => {
    if (!selectedGeometryIds.has(geometry.id)) return;
    geometryPointIds.push(...geometry.points.map((p) => p.id));
  };

  dbGeometries.forEach(addVertices);
  planGeometries.forEach(addVertices);

  return Array.from(
    new Set([...currentPoints, ...newPoints, ...geometryPointIds])
  );
}
