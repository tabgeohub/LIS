import {
  buildGeometryPointsJsonAgg,
  buildGeometrySelectFields,
} from "../../helpers/queries/geometries/geometryJson";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";
import type { Request } from "express";

function appendRegioCondition(options: {
  conditions: string[];
  params: unknown[];
  regio: ReturnType<typeof resolveRegioFilter>;
}): void {
  if (options.regio === undefined || options.regio === "admin") return;
  options.params.push(String(options.regio).toLowerCase());
  options.conditions.push(`LOWER(p.regio_id) = $${options.params.length}`);
}

export function buildGeometriesListQuery(req: Request): {
  query: string;
  params: unknown[];
} {
  const regio = resolveRegioFilter(req);
  const pointsAgg = buildGeometryPointsJsonAgg("full", "p");
  const selectFields = buildGeometrySelectFields(pointsAgg);
  const params: unknown[] = [];
  const conditions: string[] = [];

  appendRegioCondition({ conditions, params, regio });

  let query = `
      SELECT
        ${selectFields}
      FROM lis.geometries g
      JOIN lis.points p ON p.geometry_id = g.id
    `;

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY g.id ORDER BY g.id DESC";

  return { query, params };
}
