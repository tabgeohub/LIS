import { Request, Response } from "express";
import { pool } from "../../db";

export async function getAllPiloten(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT id, naam, status FROM lis.piloten ORDER BY naam ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    res.status(500).json({
      error: `Error getting all piloten: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
