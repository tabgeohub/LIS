import { Request, Response } from "express";
import { pool } from "../../db";

export async function getFlightPlanById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
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
          fp.layers,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', pt.id,
              'omschrijving', pt.omschrijving,
              'xcoordinaat_rd', pt.xcoordinaat_rd,
              'ycoordinaat_rd', pt.ycoordinaat_rd,
              'latitude', pt.latitude,
              'longitude', pt.longitude,
              'herhalen', pt.herhalen,
              'vertrouwelijk', pt.vertrouwelijk,
              'activiteit_id', pt.activiteit_id,
              'organisatie_id', pt.organisatie_id,
              'specifiek_letten_op', pt.specifiek_letten_op
            )
          ) AS points
        FROM lis.flightPlans fp
        JOIN LATERAL UNNEST(fp.points) AS point_id ON TRUE
        JOIN lis.points pt ON pt.id = point_id
        WHERE fp.id = $1
        GROUP BY fp.id
        ORDER BY fp.id;
    `,
      [id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(
      "Error fetching flight plan:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
