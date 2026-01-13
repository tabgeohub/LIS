import { Request, Response } from "express";
import { pool } from "../../db";

export async function getOrganisaties(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await pool.query(
      `
      SELECT id, naam
      FROM lis.organisaties
      ORDER BY naam ASC
      `
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching organisaties:", error);
    res.status(500).json({ message: "Failed to fetch organisaties" });
  }
}
