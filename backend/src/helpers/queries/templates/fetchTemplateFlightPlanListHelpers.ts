import { Request, Response } from "express";
import { pool } from "../../../db";
import { buildFlightPlanQuery } from "../flight-plans/buildFlightPlanQuery";
import {
  collectGeometryIds,
  fetchGeometryDataMap,
  formatTemplatePlansWithGeometries,
} from "../geometries/formatPlanGeometries";
import { resolveRegioFilter } from "../shared/resolveRegioFilter";
import { TEMPLATE_PLANS_TABLE } from "../../repositories/flightPlanSelectSql";

export async function loadFormattedTemplatePlans(
  req: Request
): Promise<unknown[]> {
  const regio_id = resolveRegioFilter(req);
  const { query, params } = buildFlightPlanQuery({
    planTable: TEMPLATE_PLANS_TABLE,
    planAlias: "tp",
    columnPreset: "template",
    pointPreset: "template",
    includeGeometryJoin: true,
    regio_id,
    regioColumn: "tp.regio_id",
    regioFilter: { caseInsensitiveAdmin: true },
  });

  const result = await pool.query(query, params);
  const geometryIds = Array.from(collectGeometryIds(result.rows));
  const geometryDataMap = await fetchGeometryDataMap(pool, geometryIds);
  return formatTemplatePlansWithGeometries(result.rows, geometryDataMap);
}

export function respondTemplateListError(res: Response, err: unknown): void {
  const detail = err instanceof Error ? err.message : String(err);
  console.error("Error fetching template flight plans:", detail);
  res.status(500).json({
    result: null,
    message: `Failed to fetch template flight plans: ${detail}`,
  });
}
