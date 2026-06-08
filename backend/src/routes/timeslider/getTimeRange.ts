import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFinishedPlansTimeRangeQuery } from "../../helpers/queries/buildFinishedPlanQuery";
import { resolveRegioFilter } from "../../helpers/resolveRegioFilter";

export async function getTimeRange(req: Request, res: Response): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);

    const { query, params } = buildFinishedPlansTimeRangeQuery(regio_id);

    const result = await pool.query(query, params);
    const row = result.rows?.[0] || { from: null, to: null };

    res.status(200).json({
      from: row.from,
      to: row.to,
    });
  } catch (error) {
    console.error("❌ Error fetching timeslider range:", error);
    res.status(500).json({
      error: `Failed to fetch time range: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}
