import { Request, Response } from "express";
import { pool } from "../../db";
import { appendRegioFilter } from "../../helpers/queries/shared/regioFilter";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";

export async function getPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const regio_id = resolveRegioFilter(req);

    const params: unknown[] = [];
    let query = `
      SELECT id, vluchtnummer, omschrijving, datum, created_at, user_id, points
      FROM lis.flightPlans
      WHERE status = 'prepared'
    `;

    query = appendRegioFilter({
      sql: query,
      params,
      regio_id,
      column: "regio_id",
      options: { caseInsensitiveAdmin: true },
    });
    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching prepared flight plans:", err);
    res.status(500).json({
      result: null,
      message: `Failed to fetch prepared flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
