import { Request, Response } from "express";
import { pool } from "../../db";

export async function getRegios(_req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(
      `
      SELECT id, naam, shape_area, shape_length
      FROM lis.regios
      `
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching regios:", error);

    res.status(500).json({
      error: `Failed to fetch regios: ${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
}
