import {
  buildGeometryPointsJsonAgg,
  buildGeometrySelectFields,
} from "../../helpers/queries/geometries/geometryJson";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";
import { buildGeometriesListFromSql } from "../../helpers/repositories/flightPlanJoinSql";
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

  const whereSql =
    conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

  const query = buildGeometriesListFromSql({ selectFields, whereSql });

  return { query, params };
}
