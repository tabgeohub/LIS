import { Request, Response } from "express";
import { pool } from "../../db";

export async function getTemplateFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    const isAdmin = regio_id && regio_id.toString().toLowerCase() === "admin";
    const shouldFilter = regio_id && !isAdmin;

    const query = `
      SELECT
        tp.id AS id,
        tp.name,
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
      FROM lis.template_plans tp
      JOIN LATERAL UNNEST(tp.points) AS point_id ON TRUE
      JOIN lis.points pt ON pt.id = point_id
      ${shouldFilter ? `WHERE tp.regio_id = $1` : ``}
      GROUP BY tp.id
      ORDER BY tp.id;
    `;

    const values = shouldFilter ? [regio_id] : [];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(
      "Error fetching template flight plans:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to fetch template flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
