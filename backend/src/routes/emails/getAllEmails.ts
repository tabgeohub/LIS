import { Request, Response } from "express";
import { pool } from "../../db";

export async function getAllEmails(req: Request, res: Response): Promise<void> {
  try {
    let query = "SELECT * FROM lis.emails em";

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    res
      .status(500)
      .json({
        error: `Error getting all emails: ${
          err instanceof Error ? err.message : String(err)
        }`,
      });
  }
}
