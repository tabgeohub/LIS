import { Geometry } from "hooks/features/useGeometriesStore";
import { EnrichedPointType, FlightPlanType } from "Types";

/** Collect all point IDs already on the plan (standalone points + geometry vertices). */
export function collectExistingPlanPointIds(plan: FlightPlanType): number[] {
  const pointSources = plan.pointsObjects?.length
    ? plan.pointsObjects
    : plan.points ?? [];

  const fromPoints = pointSources.map((p) => p.id);
  const fromGeometries = (plan.geometries ?? []).flatMap((g) =>
    g.points.map((p) => p.id)
  );

  return [...fromPoints, ...fromGeometries];
}

/** Merge existing plan geometries with newly selected ones from the database. */
export function mergeGeometries(
  existing: Geometry[] | undefined,
  newlySelectedIds: number[],
  allGeometries: Geometry[]
): Geometry[] {
  const byId = new Map<number, Geometry>();

  for (const g of existing ?? []) {
    byId.set(g.id, g);
  }

  for (const g of allGeometries) {
    if (newlySelectedIds.includes(g.id)) {
      byId.set(g.id, g);
    }
  }

  return Array.from(byId.values());
}

/** Point IDs that belong to a geometry vertex (not standalone aandachtspunten). */
export function getGeometryVertexIds(geometries: Geometry[]): Set<number> {
  return new Set(geometries.flatMap((g) => g.points.map((p) => p.id)));
}

function resolvePointsByIds(
  pointIds: number[],
  dbPoints: EnrichedPointType[],
  geometries: Geometry[]
): EnrichedPointType[] {
  const byId = new Map(dbPoints.map((p) => [p.id, p]));

  for (const geometry of geometries) {
    for (const pt of geometry.points) {
      if (pointIds.includes(pt.id) && !byId.has(pt.id)) {
        byId.set(pt.id, pt as EnrichedPointType);
      }
    }
  }

  return pointIds
    .map((id) => byId.get(id))
    .filter((p): p is EnrichedPointType => p !== undefined);
}

/**
 * Standalone aandachtspunten only — excludes vertices that belong to plan geometries.
 * Matches backend formatting in getAllFlightPlans.
 */
export function resolveStandalonePoints(
  allPointIds: number[],
  dbPoints: EnrichedPointType[],
  geometries: Geometry[]
): EnrichedPointType[] {
  const vertexIds = getGeometryVertexIds(geometries);
  const standaloneIds = allPointIds.filter((id) => !vertexIds.has(id));

  return resolvePointsByIds(standaloneIds, dbPoints, geometries);
}

export function buildUniquePointIds(
  plan: FlightPlanType,
  selectedPointIds: number[],
  selectedGeometryIds: number[],
  dbGeometries: Geometry[]
): number[] {
  const pointIdsFromNewGeometries = dbGeometries
    .filter((g) => selectedGeometryIds.includes(g.id))
    .flatMap((g) => g.points.map((p) => p.id));

  return Array.from(
    new Set([
      ...collectExistingPlanPointIds(plan),
      ...selectedPointIds,
      ...pointIdsFromNewGeometries,
    ])
  );
}
