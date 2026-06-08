import { Pool } from "pg";

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

export function formatPlansWithGeometries(plans: Record<string, unknown>[]) {
  return plans.map((plan) => {
    const points = (plan.points as RawPoint[] | null) ?? [];
    const pointsWithoutGeometry: Record<string, unknown>[] = [];
    const geometriesMap = new Map<number, GeometryGroup>();

    points.forEach((point) => {
      if (point.geometry_id) {
        const geometryId = point.geometry_id;

        if (!geometriesMap.has(geometryId)) {
          geometriesMap.set(geometryId, {
            id: geometryId,
            type: point.geometry_type ?? null,
            omschrijving: point.geometry_omschrijving ?? null,
            points: [],
          });
        }

        geometriesMap
          .get(geometryId)!
          .points.push(stripGeometryFields(point));
      } else {
        pointsWithoutGeometry.push(stripGeometryFields(point));
      }
    });

    return {
      ...plan,
      points: pointsWithoutGeometry,
      geometries: Array.from(geometriesMap.values()),
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

  const geometryQuery = `
        SELECT
          g.id,
          g.omschrijving,
          g.organisatie,
          g.vertrouwelijk,
          g.herhalen,
          g.activiteit,
          g.specifiek_letten_op,
          g.type,
          g.regio_id,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', p.id,
              'longitude', p.longitude,
              'latitude', p.latitude,
              'xcoordinaat_rd', p.xcoordinaat_rd,
              'ycoordinaat_rd', p.ycoordinaat_rd
            )
            ORDER BY p.id ASC
          ) AS points
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

export function formatFinishedPlansWithGeometries(
  plans: Record<string, unknown>[],
  pointsField = "points_data"
) {
  return plans.map((plan) => {
    const points = (plan[pointsField] as RawPoint[] | null) ?? [];
    const pointsWithoutGeometry: Record<string, unknown>[] = [];
    const geometriesMap = new Map<number, FinishedGeometryGroup>();

    points.forEach((point) => {
      if (point.geometry_id) {
        const geometryId = point.geometry_id;

        if (!geometriesMap.has(geometryId)) {
          geometriesMap.set(geometryId, {
            id: geometryId,
            geometry_type: point.geometry_type ?? null,
            geometry_omschrijving: point.geometry_omschrijving ?? null,
            points: [],
          });
        }

        geometriesMap
          .get(geometryId)!
          .points.push(stripGeometryFields(point));
      } else {
        pointsWithoutGeometry.push(stripGeometryFields(point));
      }
    });

    return {
      ...plan,
      [pointsField]: pointsWithoutGeometry,
      geometries: Array.from(geometriesMap.values()),
    };
  });
}

export function formatTemplatePlansWithGeometries(
  plans: Record<string, unknown>[],
  geometryDataMap: Map<number, Record<string, unknown>>
) {
  return plans.map((plan) => {
    const points = (plan.points as RawPoint[] | null) ?? [];
    const pointsWithoutGeometry: Record<string, unknown>[] = [];
    const geometriesMap = new Map<number, GeometryGroup>();

    points.forEach((point) => {
      if (point.geometry_id) {
        const geometryId = point.geometry_id;

        if (!geometriesMap.has(geometryId)) {
          const fullGeometryData = geometryDataMap.get(geometryId);

          if (fullGeometryData) {
            geometriesMap.set(geometryId, {
              id: geometryId,
              type: (fullGeometryData.type as string | null) ?? null,
              omschrijving:
                (fullGeometryData.omschrijving as string | null) ?? null,
              organisatie: fullGeometryData.organisatie,
              vertrouwelijk: fullGeometryData.vertrouwelijk,
              herhalen: fullGeometryData.herhalen,
              activiteit: fullGeometryData.activiteit,
              specifiek_letten_op: fullGeometryData.specifiek_letten_op,
              regio_id: fullGeometryData.regio_id,
              points:
                (fullGeometryData.points as Record<string, unknown>[]) ?? [],
            });
          } else {
            geometriesMap.set(geometryId, {
              id: geometryId,
              type: point.geometry_type ?? null,
              omschrijving: point.geometry_omschrijving ?? null,
              points: [],
            });
          }
        }
      } else {
        pointsWithoutGeometry.push(stripGeometryFields(point));
      }
    });

    return {
      ...plan,
      points: pointsWithoutGeometry,
      geometries: Array.from(geometriesMap.values()),
    };
  });
}
