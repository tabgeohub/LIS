import { Request, Response } from "express";
import { pool } from "../../db";

export async function getPreparedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { regio_id } = req.query;

    const params: any[] = [];
    let query = `
      SELECT id, vluchtnummer, omschrijving, datum, created_at, user_id, points
      FROM lis.flightPlans
      WHERE status = 'prepared'
    `;

    if (regio_id && regio_id !== "admin") {
      params.push(regio_id);
      query += ` AND regio_id = $${params.length}`;
    }

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
