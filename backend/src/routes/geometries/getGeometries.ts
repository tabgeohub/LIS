import { Request, Response } from "express";
import { pool } from "../../db";
import { resolveRegioFilter } from "../../helpers/resolveRegioFilter";

export async function getGeometries(req: Request, res: Response): Promise<void> {
  try {
    const regio = resolveRegioFilter(req);

    let query = `
      SELECT
        g.id,
        g.omschrijving,
        g.organisatie,
        g.vertrouwelijk,
        g.herhalen,
        g.activiteit,
        g.specifiek_letten_op,
        g.type,
        g.regio_id,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', p.id,
            'omschrijving', p.omschrijving,
            'regio_id', p.regio_id,
            'xcoordinaat_rd', p.xcoordinaat_rd,
            'ycoordinaat_rd', p.ycoordinaat_rd,
            'latitude', p.latitude,
            'longitude', p.longitude,
            'herhalen', p.herhalen,
            'vertrouwelijk', p.vertrouwelijk,
            'user_id', p.user_id,
            'activiteit_id', p.activiteit_id,
            'organisatie_id', p.organisatie_id,
            'specifiek_letten_op', p.specifiek_letten_op,
            'geometry_id', p.geometry_id,
            'status', p.status,
            'created_at', p.created_at
          )
          ORDER BY p.id ASC
        ) AS points
      FROM lis.geometries g
      JOIN lis.points p ON p.geometry_id = g.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    // regio_id (skip when admin)
    if (regio !== undefined && regio !== "admin") {
      params.push(String(regio).toLowerCase());
      conditions.push(`LOWER(p.regio_id) = $${params.length}`);
    }

    // apply conditions
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY g.id ORDER BY g.id DESC";

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));

    res.status(500).json({
      error: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

