import { Request, Response } from "express";
import { pool } from "../../db";

export async function getPartialFinishedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    const isAdmin = regio_id && regio_id.toString().toLowerCase() === "admin";
    const shouldFilter = regio_id && !isAdmin;

    const sql = `
      /* Ensure exactly one row per (plan_id, point_id) to avoid duplicates */
      WITH points_per_plan AS (
        SELECT DISTINCT
          plan_id,
          point_id
        FROM lis.finished_plans
      )
      SELECT
        fp.*,
        jsonb_agg(
          jsonb_strip_nulls(
            jsonb_build_object(
              'id',               pt.id,
              'omschrijving',     pt.omschrijving,
              'regio_id',         pt.regio_id,
              'xcoordinaat_rd',   pt.xcoordinaat_rd,
              'ycoordinaat_rd',   pt.ycoordinaat_rd,
              'latitude',         pt.latitude,
              'longitude',        pt.longitude,
              'herhalen',         pt.herhalen,
              'user_id',          pt.user_id,
              'datum',            pt.created_at,
              'organisatie_id',   pt.organisatie_id
            )
          )
          ORDER BY pt.created_at, pt.id
        ) AS points_data
      FROM lis.flightplans fp
      JOIN points_per_plan ppp
        ON ppp.plan_id = fp.id
      JOIN lis.points pt
        ON pt.id = ppp.point_id
      WHERE fp.status = 'finished'
      ${shouldFilter ? `AND fp.regio_id = $1` : ``}
      GROUP BY fp.id;
    `;

    const params: any[] = shouldFilter ? [regio_id] : [];

    const result = await pool.query(sql, params);

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("❌ Error fetching finished flightplans:", error);
    res.status(500).json({
      message: "Failed to fetch finished flightplans",
      error: {
        name: error?.name,
        code: error?.code,
        hint: error?.hint,
        position: error?.position,
        detail: error?.detail,
        stack: error?.stack,
      },
    });
  }
}
