export function buildPointsUnnestJoin(
  planAlias: string,
  includeGeometry = false
): string {
  const join = `JOIN LATERAL UNNEST(${planAlias}.points) AS point_id ON TRUE
      JOIN lis.points pt ON pt.id = point_id`;

  if (!includeGeometry) {
    return join;
  }

  return `${join}
      LEFT JOIN lis.geometries g ON g.id = pt.geometry_id`;
}

export const FLIGHT_PLAN_POINTS_JOIN = buildPointsUnnestJoin("fp");

export const FINISHED_PLANS_POINTS_CTE = `
      WITH points_per_plan AS (
        SELECT DISTINCT plan_id, point_id
        FROM lis.finished_plans
      )`;
