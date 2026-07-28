import { Request, Response } from "express";
import { pool } from "../../db";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";
import { selectPreparedFlightPlans } from "../../helpers/repositories/flightPlansRepo";

export async function getPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);
    const result = await selectPreparedFlightPlans(pool, regio_id);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching prepared flight plans:", err);
    res.status(500).json({
      result: null,
      message: `Failed to fetch prepared flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
