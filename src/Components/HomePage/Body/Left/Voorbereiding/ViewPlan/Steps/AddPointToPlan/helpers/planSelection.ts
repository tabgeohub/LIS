import { Geometry } from "hooks/features/useGeometriesStore";
import { EnrichedPointType, FlightPlanType } from "Types";

function planPointSources(plan: FlightPlanType) {
  if (plan.pointsObjects?.length) return plan.pointsObjects;
  return plan.points ?? [];
}

/** Collect all point IDs already on the plan (standalone points + geometry vertices). */
export function collectExistingPlanPointIds(plan: FlightPlanType): number[] {
  const fromPoints = planPointSources(plan).map((p) => p.id);
  const fromGeometries = (plan.geometries ?? []).flatMap((g) =>
    g.points.map((p) => p.id)
  );

  return [...fromPoints, ...fromGeometries];
}

function addGeometryIfSelected(input: {
  byId: Map<number, Geometry>;
  geometry: Geometry;
  newlySelectedIds: number[];
}) {
  if (!input.newlySelectedIds.includes(input.geometry.id)) return;
  input.byId.set(input.geometry.id, input.geometry);
}

/** Merge existing plan geometries with newly selected ones from the database. */
export function mergeGeometries(input: {
  existing: Geometry[] | undefined;
  newlySelectedIds: number[];
  allGeometries: Geometry[];
}): Geometry[] {
  const byId = new Map<number, Geometry>();

  for (const g of input.existing ?? []) {
    byId.set(g.id, g);
  }

  for (const g of input.allGeometries) {
    addGeometryIfSelected({
      byId,
      geometry: g,
      newlySelectedIds: input.newlySelectedIds,
    });
  }

  return Array.from(byId.values());
}

/** Point IDs that belong to a geometry vertex (not standalone aandachtspunten). */
export function getGeometryVertexIds(geometries: Geometry[]): Set<number> {
  return new Set(geometries.flatMap((g) => g.points.map((p) => p.id)));
}

function resolvePointsByIds(input: {
  pointIds: number[];
  dbPoints: EnrichedPointType[];
  geometries: Geometry[];
}): EnrichedPointType[] {
  const byId = new Map(input.dbPoints.map((p) => [p.id, p]));

  for (const geometry of input.geometries) {
    for (const pt of geometry.points) {
      if (input.pointIds.includes(pt.id) && !byId.has(pt.id)) {
        byId.set(pt.id, pt as EnrichedPointType);
      }
    }
  }

  return input.pointIds
    .map((id) => byId.get(id))
    .filter((p): p is EnrichedPointType => p !== undefined);
}

/**
 * Standalone aandachtspunten only — excludes vertices that belong to plan geometries.
 * Matches backend formatting in getAllFlightPlans.
 */
export function resolveStandalonePoints(input: {
  allPointIds: number[];
  dbPoints: EnrichedPointType[];
  geometries: Geometry[];
}): EnrichedPointType[] {
  const vertexIds = getGeometryVertexIds(input.geometries);
  const standaloneIds = input.allPointIds.filter((id) => !vertexIds.has(id));

  return resolvePointsByIds({
    pointIds: standaloneIds,
    dbPoints: input.dbPoints,
    geometries: input.geometries,
  });
}

export function buildUniquePointIds(input: {
  plan: FlightPlanType;
  selectedPointIds: number[];
  selectedGeometryIds: number[];
  dbGeometries: Geometry[];
}): number[] {
  const pointIdsFromNewGeometries = input.dbGeometries
    .filter((g) => input.selectedGeometryIds.includes(g.id))
    .flatMap((g) => g.points.map((p) => p.id));

  return Array.from(
    new Set([
      ...collectExistingPlanPointIds(input.plan),
      ...input.selectedPointIds,
      ...pointIdsFromNewGeometries,
    ])
  );
}
