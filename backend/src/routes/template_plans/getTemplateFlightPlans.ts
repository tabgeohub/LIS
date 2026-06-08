import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFlightPlanQuery } from "../../helpers/queries/buildFlightPlanQuery";
import {
  collectGeometryIds,
  fetchGeometryDataMap,
  formatTemplatePlansWithGeometries,
} from "../../helpers/queries/formatPlanGeometries";
import { resolveRegioFilter } from "../../helpers/resolveRegioFilter";

export async function getTemplateFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);

    const { query, params } = buildFlightPlanQuery({
      planTable: "lis.template_plans",
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
    const formattedPlans = formatTemplatePlansWithGeometries(
      result.rows,
      geometryDataMap
    );

    res.status(200).json(formattedPlans);
  } catch (err) {
    console.error(
      "Error fetching template flight plans:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to fetch template flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
