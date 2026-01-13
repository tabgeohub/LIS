import { Request, Response } from "express";
import { pool } from "../../db";

export async function getFinishedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await pool.query(
      `
      SELECT
        fp.*,
        jsonb_agg(
          jsonb_strip_nulls(
            jsonb_build_object(
              'id', pt.id,
              'omschrijving', pt.omschrijving,
              'regio_id', pt.regio_id,
              'xcoordinaat_rd', pt.xcoordinaat_rd,
              'ycoordinaat_rd', pt.ycoordinaat_rd,
              'latitude', pt.latitude,
              'longitude', pt.longitude,
              'vertrouwelijk', pt.vertrouwelijk,
              'herhalen', pt.herhalen,
              'user_id', pt.user_id,
              'activiteit_id', pt.activiteit_id,
              'organisatie_id', pt.organisatie_id,
              'specifiek_letten_op', pt.specifiek_letten_op,
              'datum', pt.created_at,
              'point_order', ffp.point_order,
              'point_comment', ffp.pointComment,
              'attachments', att_list.attachments
            )
          )
        ) AS points_data,
        fpp.path AS path
      FROM lis.flightplans fp
      JOIN lis.finished_plans ffp ON ffp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ffp.point_id
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(a.*) AS attachments
        FROM lis.attachments a
        WHERE a.id = ANY(ffp.attachments_id)
      ) AS att_list ON true
      LEFT JOIN lis.finished_plans_path fpp ON fpp.planid = fp.id
      WHERE fp.status = 'finished'
      GROUP BY fp.id, fpp.path;
      `
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching finished flightplans:", error);
    res.status(500).json({ message: "Failed to fetch finished flightplans" });
  }
}
