import { Request, Response } from "express";
import { pool } from "../../db";

export async function getPrepreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    let query = `
      SELECT
        fp.id AS id,
        fp.vluchtnummer,
        fp.omschrijving,
        fp.datum,
        fp.user_id,
        fp.status,
        fp.basemap,
        fp.created_at,
        fp.vliegduur,
        fp.luchtvaartuig,
        fp.passagiers,
        fp.hoofdthema,
        fp.aanvullende,
        fp.piloot,
        fp.waarnemer,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', pt.id,
            'omschrijving', pt.omschrijving,
            'xcoordinaat_rd', pt.xcoordinaat_rd,
            'ycoordinaat_rd', pt.ycoordinaat_rd,
            'latitude', pt.latitude,
            'longitude', pt.longitude,
            'regio_id', pt.regio_id,
            'herhalen', pt.herhalen,
            'vertrouwelijk', pt.vertrouwelijk,
            'user_id', pt.user_id,
            'specifiek_letten_op', pt.specifiek_letten_op
          )
        ) AS points
      FROM lis.flightPlans fp
      JOIN LATERAL UNNEST(fp.points) AS point_id ON TRUE
      JOIN lis.points pt ON pt.id = point_id
      WHERE fp.status = 'pre-prepared'
    `;

    const params: any[] = [];

    // add filter only if regio_id is provided and not "admin"
    if (regio_id && regio_id !== "admin") {
      params.push(regio_id);
      query += ` AND fp.regio_id = $${params.length}`;
    }

    query += ` GROUP BY fp.id ORDER BY fp.created_at DESC`;

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(
      "❌ Error fetching pre-prepared flight plans:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch pre-prepared flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
