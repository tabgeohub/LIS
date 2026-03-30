import type { Geometry } from "hooks/features/useGeometriesStore";

export type GeometryPointRow = NonNullable<Geometry["points"]>[number];

export function cloneGeometryPoints(
  points: Geometry["points"]
): GeometryPointRow[] {
  return (points ?? []).map((p) => ({ ...p }));
}
