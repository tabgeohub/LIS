import { Request, Response } from "express";
import { pool } from "../../db";

export async function getSingleFinishedFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
  const { planId } = req.params;

  try {
    const result = await pool.query(
      `
      /* Scope finished_plans to the requested plan */
      WITH ffp_rows AS (
        SELECT *
        FROM lis.finished_plans
        WHERE plan_id = $1
      ),
      /* Collapse to exactly one row per (plan_id, point_id) to avoid duplicates */
      points_per_plan AS (
        SELECT
          plan_id,
          point_id,
          MAX(point_order)  AS point_order,
          MAX(pointcomment) AS point_comment
        FROM ffp_rows
        GROUP BY plan_id, point_id
      ),
      /* Gather unique attachments per point (attachments_id may be NULL) */
      attachments_per_point AS (
        SELECT
          f.point_id,
          jsonb_agg(DISTINCT a.*) AS attachments
        FROM ffp_rows f
        LEFT JOIN lis.attachments a
          ON a.id = ANY(f.attachments_id)
        GROUP BY f.point_id
      )
      SELECT
        fp.*,
        fpp.path       AS path,
        fpp.flighttime AS flighttime,
        jsonb_agg(
          jsonb_strip_nulls(
            jsonb_build_object(
              'id',                  pt.id,
              'omschrijving',        pt.omschrijving,
              'regio_id',            pt.regio_id,
              'xcoordinaat_rd',      pt.xcoordinaat_rd,
              'ycoordinaat_rd',      pt.ycoordinaat_rd,
              'latitude',            pt.latitude,
              'longitude',           pt.longitude,
              'vertrouwelijk',       pt.vertrouwelijk,
              'herhalen',            pt.herhalen,
              'user_id',             pt.user_id,
              'activiteit_id',       pt.activiteit_id,
              'organisatie_id',      pt.organisatie_id,
              'specifiek_letten_op', pt.specifiek_letten_op,
              'datum',               pt.created_at,
              'point_order',         ppp.point_order,
              'point_comment',       ppp.point_comment,
              'attachments',         ap.attachments
            )
          )
          ORDER BY ppp.point_order NULLS LAST, pt.id
        ) AS points_data
      FROM lis.flightplans fp
      JOIN points_per_plan ppp
        ON ppp.plan_id = fp.id
      JOIN lis.points pt
        ON pt.id = ppp.point_id
      LEFT JOIN attachments_per_point ap
        ON ap.point_id = ppp.point_id
      /* New: join the per-plan path/flighttime (id, path jsonb, planid int, flighttime jsonb) */
      LEFT JOIN lis.finished_plans_path fpp
        ON fpp.planid = fp.id
      WHERE fp.status = 'finished'
        AND fp.id = $1
      GROUP BY fp.id, fpp.path, fpp.flighttime;
      `,
      [planId]
    );

    res.status(200).json(result.rows[0] || null);
  } catch (error: any) {
    console.error("❌ Error fetching finished flightplan:", error);
    res.status(500).json({
      message: "Failed to fetch finished flightplan",
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
