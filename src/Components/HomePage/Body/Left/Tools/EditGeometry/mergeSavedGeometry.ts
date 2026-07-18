import type { Geometry } from "hooks/features/useGeometriesStore";

export function mergeSavedGeometry(input: {
  editingGeometry: Geometry;
  payload: Record<string, unknown> & { points?: Geometry["points"] };
  result?: Partial<Geometry> & { points?: Geometry["points"] };
}): Geometry {
  return {
    ...input.editingGeometry,
    ...input.payload,
    ...(input.result ?? {}),
    points: (input.result?.points ?? input.payload.points) as Geometry["points"],
  };
}

export function replaceGeometryInList(
  geometries: Geometry[],
  updated: Geometry
) {
  return geometries.map((g) => (g.id === updated.id ? updated : g));
}
