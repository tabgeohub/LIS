import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFlightPlanQuery } from "../../helpers/queries/buildFlightPlanQuery";
import { formatPlansWithGeometries } from "../../helpers/queries/formatPlanGeometries";
import { resolveRegioFilter } from "../../helpers/resolveRegioFilter";

export async function getAllFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);

    const { query, params } = buildFlightPlanQuery({
      columnPreset: "all",
      pointPreset: "full",
      includeGeometryJoin: true,
      where: "fp.status <> 'inactief'",
      regio_id,
      regioFilter: { caseInsensitiveAdmin: true },
    });

    const result = await pool.query(query, params);
    const formattedPlans = formatPlansWithGeometries(result.rows);

    res.status(200).json(formattedPlans);
  } catch (err) {
    console.error(
      "❌ Error fetching flight plans:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
