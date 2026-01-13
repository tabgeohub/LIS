import { Request, Response } from "express";
import { pool } from "../../db";

export async function getSearchedPoints(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { omschrijving } = req.params;

    const result = await pool.query(
      `
      SELECT 
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
      WHERE LOWER(pt.omschrijving) LIKE LOWER($1)
    `,
      [`%${omschrijving}%`]
    );

    res.json(result.rows[0].points || []);
  } catch (err) {
    console.error(
      "Error fetching searched points:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      error: `Error fetching searched points: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
