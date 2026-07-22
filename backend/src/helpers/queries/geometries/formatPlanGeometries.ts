import { Pool } from "pg";
import {
  buildGeometryPointsJsonAgg,
  buildGeometrySelectFields,
} from "./geometryJson";
import { buildTemplateGeometryGroup } from "./buildTemplateGeometryGroup";

type RawPoint = Record<string, unknown> & {
  geometry_id?: number | null;
  geometry_type?: string | null;
  geometry_omschrijving?: string | null;
};

type GeometryGroup = {
  id: number;
  type: string | null;
  omschrijving: string | null;
  points: Record<string, unknown>[];
  organisatie?: unknown;
  vertrouwelijk?: unknown;
  herhalen?: unknown;
  activiteit?: unknown;
  specifiek_letten_op?: unknown;
  regio_id?: unknown;
};

function stripGeometryFields(point: RawPoint) {
  const {
    geometry_id: _geometryId,
    geometry_type: _geometryType,
    geometry_omschrijving: _geometryOmschrijving,
    ...pointWithoutGeometry
  } = point;

  return pointWithoutGeometry;
}

type SplitPointsOptions<T> = {
  createGeometryGroup: (point: RawPoint, geometryId: number) => T;
  addPointToGeometry: (group: T, point: RawPoint) => void;
};

function assignPointToGeometryGroup<T>(
  point: RawPoint,
  geometriesMap: Map<number, T>,
  options: SplitPointsOptions<T>
): void {
  const geometryId = point.geometry_id!;
  if (!geometriesMap.has(geometryId)) {
    geometriesMap.set(
      geometryId,
      options.createGeometryGroup(point, geometryId)
    );
  }
  options.addPointToGeometry(geometriesMap.get(geometryId)!, point);
}

function splitPointsByGeometry<T>(
  points: RawPoint[],
  options: SplitPointsOptions<T>
): { standalonePoints: Record<string, unknown>[]; geometries: T[] } {
  const standalonePoints: Record<string, unknown>[] = [];
  const geometriesMap = new Map<number, T>();

  points.forEach((point) => {
    if (!point.geometry_id) {
      standalonePoints.push(stripGeometryFields(point));
      return;
    }
    assignPointToGeometryGroup(point, geometriesMap, options);
  });

  return {
    standalonePoints,
    geometries: Array.from(geometriesMap.values()),
  };
}

function createPlanGeometryGroup(
  point: RawPoint,
  geometryId: number
): GeometryGroup {
  return {
    id: geometryId,
    type: point.geometry_type ?? null,
    omschrijving: point.geometry_omschrijving ?? null,
    points: [],
  };
}

function addStrippedPointToGroup(group: GeometryGroup, point: RawPoint): void {
  group.points.push(stripGeometryFields(point));
}

export function formatPlansWithGeometries(plans: Record<string, unknown>[]) {
  return plans.map((plan) => {
    const points = (plan.points as RawPoint[] | null) ?? [];
    const { standalonePoints, geometries } = splitPointsByGeometry<GeometryGroup>(
      points,
      {
        createGeometryGroup: createPlanGeometryGroup,
        addPointToGeometry: addStrippedPointToGroup,
      }
    );

    return {
      ...plan,
      points: standalonePoints,
      geometries,
    };
  });
}

export function collectGeometryIds(plans: Record<string, unknown>[]): Set<number> {
  const allGeometryIds = new Set<number>();

  plans.forEach((plan) => {
    const points = (plan.points as RawPoint[] | null) ?? [];
    points.forEach((point) => {
      if (point.geometry_id) {
        allGeometryIds.add(point.geometry_id);
      }
    });
  });

  return allGeometryIds;
}

export async function fetchGeometryDataMap(
  pool: Pool,
  geometryIds: number[]
): Promise<Map<number, Record<string, unknown>>> {
  const geometryDataMap = new Map<number, Record<string, unknown>>();

  if (geometryIds.length === 0) {
    return geometryDataMap;
  }

  const pointsAgg = buildGeometryPointsJsonAgg("coords", "p");
  const selectFields = buildGeometrySelectFields(pointsAgg);
  const geometryQuery = `
        SELECT
          ${selectFields}
        FROM lis.geometries g
        JOIN lis.points p ON p.geometry_id = g.id
        WHERE g.id = ANY($1)
        GROUP BY g.id
      `;

  const geometryResult = await pool.query(geometryQuery, [geometryIds]);
  geometryResult.rows.forEach((geo: Record<string, unknown>) => {
    geometryDataMap.set(geo.id as number, geo);
  });

  return geometryDataMap;
}

type FinishedGeometryGroup = {
  id: number;
  geometry_type: string | null;
  geometry_omschrijving: string | null;
  points: Record<string, unknown>[];
};

function createFinishedGeometryGroup(
  point: RawPoint,
  geometryId: number
): FinishedGeometryGroup {
  return {
    id: geometryId,
    geometry_type: point.geometry_type ?? null,
    geometry_omschrijving: point.geometry_omschrijving ?? null,
    points: [],
  };
}

function addStrippedPointToFinishedGroup(
  group: FinishedGeometryGroup,
  point: RawPoint
): void {
  group.points.push(stripGeometryFields(point));
}

export function formatFinishedPlansWithGeometries(
  plans: Record<string, unknown>[],
  pointsField = "points_data"
) {
  return plans.map((plan) => {
    const points = (plan[pointsField] as RawPoint[] | null) ?? [];
    const { standalonePoints, geometries } =
      splitPointsByGeometry<FinishedGeometryGroup>(points, {
        createGeometryGroup: createFinishedGeometryGroup,
        addPointToGeometry: addStrippedPointToFinishedGroup,
      });

    return {
      ...plan,
      [pointsField]: standalonePoints,
      geometries,
    };
  });
}

export function formatTemplatePlansWithGeometries(
  plans: Record<string, unknown>[],
  geometryDataMap: Map<number, Record<string, unknown>>
) {
  return plans.map((plan) => {
    const points = (plan.points as RawPoint[] | null) ?? [];
    const { standalonePoints, geometries } = splitPointsByGeometry(points, {
      createGeometryGroup: (point, geometryId) =>
        buildTemplateGeometryGroup({ point, geometryId, geometryDataMap }),
      addPointToGeometry: () => {},
    });

    return {
      ...plan,
      points: standalonePoints,
      geometries,
    };
  });
}
