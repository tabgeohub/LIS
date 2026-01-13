import { Request, Response } from "express";
import { pool } from "../../db";

export async function getActiviteiten(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await pool.query(
      `
      SELECT id, activiteit
      FROM lis.activiteiten
      ORDER BY activiteit ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching activiteiten:", error);
    res.status(500).json({ message: "Failed to fetch activiteiten" });
  }
}
