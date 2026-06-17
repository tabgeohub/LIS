import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFlightPlanQuery } from "./buildFlightPlanQuery";
import {
  collectGeometryIds,
  fetchGeometryDataMap,
  formatTemplatePlansWithGeometries,
} from "./formatPlanGeometries";
import { resolveRegioFilter } from "../resolveRegioFilter";

export async function findTemplatePlanByName(name: string) {
  return pool.query(`SELECT * FROM lis.template_plans WHERE name = $1`, [name]);
}

export function respondTemplateNameTaken(res: Response): void {
  res.status(400).json({
    result: null,
    message: "Er bestaat al een sjabloon met deze naam.",
  });
}

export async function fetchTemplateFlightPlanList(
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
