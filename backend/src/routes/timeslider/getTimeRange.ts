import { Request, Response } from "express";
import { pool } from "../../db";

export async function getTimeRange(req: Request, res: Response): Promise<void> {
  try {
    const { regio_id } = req.query;

    let query = `
      SELECT
        MIN(fp.created_at) AS "from",
        MAX(fp.created_at) AS "to"
      FROM lis.flightPlans fp
      WHERE fp.created_at IS NOT NULL
        AND fp.status <> 'inactief'
    `;

    const params: any[] = [];

    if (regio_id && regio_id !== "admin") {
      params.push(regio_id);
      query += ` AND fp.regio_id = $${params.length}`;
    }

    const result = await pool.query(query, params);
    const row = result.rows?.[0] || { from: null, to: null };

    res.status(200).json({
      from: row.from,
      to: row.to,
    });
  } catch (error) {
    console.error("❌ Error fetching timeslider range:", error);
    res.status(500).json({
      error: `Failed to fetch time range: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}
