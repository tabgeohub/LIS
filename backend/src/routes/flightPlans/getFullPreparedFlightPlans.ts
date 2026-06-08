import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFlightPlanQuery } from "../../helpers/queries/buildFlightPlanQuery";
import { resolveRegioFilter } from "../../helpers/resolveRegioFilter";

export async function getFullPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);

    const { query, params } = buildFlightPlanQuery({
      columnPreset: "prepared",
      pointPreset: "minimal",
      where: "fp.status = 'prepared'",
      regio_id,
      regioFilter: { caseInsensitiveAdmin: true },
    });

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(
      "Error fetching flight plans:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: "Failed to fetch partial flight plans",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
