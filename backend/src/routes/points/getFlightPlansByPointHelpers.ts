import type { Response } from "express";
import { pool } from "../../db";

const FLIGHT_PLANS_BY_POINT_SQL = `
      SELECT
        f.*,
        CASE 
          WHEN f.status = 'finished' AND EXISTS (
            SELECT 1 FROM lis.finished_plans ffp WHERE ffp.plan_id = f.id
          ) THEN true
          ELSE false
        END AS is_finished,
        jsonb_agg(
          jsonb_build_object(
            'point', p.*,
            'finished_plan', fp.*
          )
        ) AS detailed_points
      FROM lis.flightplans f
      JOIN LATERAL unnest(f.points) AS point_id ON TRUE
      JOIN lis.points p ON p.id = point_id
      LEFT JOIN lis.finished_plans fp ON fp.point_id = p.id AND fp.plan_id = f.id
      WHERE $1 = ANY(f.points)
      GROUP BY f.id;
      `;

export async function queryFlightPlansByPoint(
  pointId: string
): Promise<unknown[]> {
  const result = await pool.query(FLIGHT_PLANS_BY_POINT_SQL, [
    parseInt(pointId, 10),
  ]);
  return result.rows;
}

export function sendFlightPlansByPointError(
  res: Response,
  err: unknown
): void {
  console.error(
    "Error fetching flight plans by point:",
    err instanceof Error ? err.message : String(err)
  );
  res.status(500).json({
    message: `Failed to fetch flight plans. Error: ${
      err instanceof Error ? err.message : String(err)
    }`,
  });
}
