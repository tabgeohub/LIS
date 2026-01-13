import { Request, Response } from "express";
import { pool } from "../../db";

export async function getUsers(req: Request, res: Response) {
  try {
    const result = await pool.query("SELECT * FROM lis.users ORDER BY user_id");

    res.json(result.rows);
  } catch (err) {
    console.error(
      `Error fetching users: ${
        err instanceof Error ? err.message : String(err)
      }`
    );

    res.status(500).json({
      error: `Error fetching users: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
