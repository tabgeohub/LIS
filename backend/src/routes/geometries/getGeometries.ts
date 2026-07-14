import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildGeometryPointsJsonAgg,
  buildGeometrySelectFields,
} from "../../helpers/queries/geometries/geometryJson";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";

export async function getGeometries(req: Request, res: Response): Promise<void> {
  try {
    const regio = resolveRegioFilter(req);
    const pointsAgg = buildGeometryPointsJsonAgg("full", "p");
    const selectFields = buildGeometrySelectFields(pointsAgg);

    let query = `
      SELECT
        ${selectFields}
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
