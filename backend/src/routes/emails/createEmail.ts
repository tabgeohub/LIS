import { Request, Response } from "express";
import { pool } from "../../db";

export async function createEmail(req: Request, res: Response): Promise<void> {
  const { email, regio } = req.body;

  if (!email) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO lis.emails (email, regio_id) VALUES ($1, $2) RETURNING *;`,
      [email, regio]
    );

    res.status(201).json({
      result: result.rows[0],
      message: "E-mail succesvol aangemaakt",
    });
  } catch (err) {
    console.error(
      "Error creating email:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to create email: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
