import { Geometry } from "hooks/features";

function asIdArray(value: number[] | unknown): number[] {
  return Array.isArray(value) ? value : [];
}

export function collectTemplateFlightPointIds(input: {
  selectedGeometries: number[] | unknown;
  selectedGeometries2: number[] | unknown;
  selectedPoints: number[] | unknown;
  selectedPoints2: number[] | unknown;
  dbGeometries: Geometry[];
}) {
  const uniqueSelectedGeometryIds = Array.from(
    new Set([
      ...asIdArray(input.selectedGeometries),
      ...asIdArray(input.selectedGeometries2),
    ])
  );
  const geometryPointIds = input.dbGeometries
    .filter((geometry) => uniqueSelectedGeometryIds.includes(geometry.id))
    .flatMap((geometry) => geometry.points.map((point) => point.id));
  const uniquePointIds = Array.from(
    new Set([
      ...asIdArray(input.selectedPoints),
      ...asIdArray(input.selectedPoints2),
      ...geometryPointIds,
    ])
  );
  return { uniquePointIds, uniqueSelectedGeometryIds };
}
