import { Request, Response } from "express";
import { pool } from "../../db";

export async function getFlightPlansByPoint(
  req: Request,
  res: Response
): Promise<void> {
  const { pointId } = req.params;

  if (!pointId) {
    res.status(400).json({ message: "Missing pointId parameter" });
    return;
  }

  try {
    const result = await pool.query(
      `
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
      `,
      [parseInt(pointId, 10)]
    );

    res.status(200).json(result.rows);
  } catch (err) {
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
}
