export function buildPointsUnnestJoin(
  planAlias: string,
  includeGeometry = false
): string {
  // The array is the only existing membership/vertex ordering source for a
  // flight plan. Preserve its ordinality all the way to the JSON aggregate;
  // point id ordering would silently change a line/polygon's vertex order.
  const join = `JOIN LATERAL UNNEST(${planAlias}.points) WITH ORDINALITY AS plan_member(point_id, member_order) ON TRUE
      JOIN lis.points pt ON pt.id = plan_member.point_id`;

  if (!includeGeometry) {
    return join;
  }

  return `${join}
      LEFT JOIN lis.geometries g ON g.id = pt.geometry_id`;
}

export const FLIGHT_PLAN_POINTS_JOIN = buildPointsUnnestJoin("fp");

export function buildPointSearchQuerySql(input: {
  pointJson: string;
  joins: string;
  whereClause: string;
}): string {
  return `
      SELECT 
        JSON_AGG(
          ${input.pointJson}
        ) AS points
      FROM lis.flightPlans fp
      ${input.joins}
      WHERE ${input.whereClause}
    `;
}

export function buildGeometriesListFromSql(input: {
  selectFields: string;
  whereSql: string;
}): string {
  return `
      SELECT
        ${input.selectFields}
      FROM lis.geometries g
      JOIN lis.points p ON p.geometry_id = g.id
    ${input.whereSql}
      GROUP BY g.id ORDER BY g.id DESC`;
}

export function buildGeometryDataMapSql(selectFields: string): string {
  return `
        SELECT
          ${selectFields}
        FROM lis.geometries g
        JOIN lis.points p ON p.geometry_id = g.id
        WHERE g.id = ANY($1)
        GROUP BY g.id
      `;
}

export function buildPointsListSelectSql(whereSql: string): string {
  let sql = "SELECT * FROM lis.points";
  if (whereSql) {
    sql += " WHERE " + whereSql;
  }
  sql += " ORDER BY id DESC";
  return sql;
}
