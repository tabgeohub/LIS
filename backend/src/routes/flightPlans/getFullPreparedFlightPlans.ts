import { Request, Response } from "express";
import { pool } from "../../db";

export async function getFullPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    const isAdmin = !!regio_id && regio_id.toString().toLowerCase() === "admin";
    const shouldFilter = !!regio_id && !isAdmin;

    const sql = `
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
            'regio_id', pt.regio_id
          )
        ) AS points
      FROM lis.flightPlans fp
      JOIN LATERAL UNNEST(fp.points) AS point_id ON TRUE
      JOIN lis.points pt ON pt.id = point_id
      WHERE fp.status = 'prepared'
      ${shouldFilter ? `AND fp.regio_id = $1` : ``}
      GROUP BY fp.id
      ORDER BY fp.created_at DESC
    `;

    const params: any[] = shouldFilter ? [regio_id] : [];

    const result = await pool.query(sql, params);
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
