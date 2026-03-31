import { Request, Response } from "express";
import { pool } from "../../db";

/**
 * Min/max dates for the timeslider: same population as getFinishedPlansTimeslider
 * (finished flight plans with points in finished_plans, optional regio filter; admin = all regions).
 */
export async function getTimeRange(req: Request, res: Response): Promise<void> {
  try {
    const { regio_id } = req.query;

    const isAdmin =
      regio_id != null && regio_id.toString().toLowerCase() === "admin";
    const shouldFilter = regio_id != null && !isAdmin;

    let query = `
      WITH points_per_plan AS (
        SELECT DISTINCT plan_id, point_id
        FROM lis.finished_plans
      )
      SELECT
        MIN(fp.datum::date) AS "from",
        MAX(fp.datum::date) AS "to"
      FROM lis.flightplans fp
      JOIN points_per_plan ppp ON ppp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ppp.point_id
      WHERE fp.status = 'finished'
        AND fp.datum IS NOT NULL
    `;

    const params: unknown[] = [];
    if (shouldFilter) {
      params.push(regio_id);
      query += ` AND fp.regio_id = $${params.length}`;
    }

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
