import { Request, Response } from "express";
import { pool } from "../../db";

export async function editSingleEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { id, email } = req.body;

  if (!id) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE lis.emails SET email = $1 WHERE id = $2 RETURNING *`,
      [email, Number(id)]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        result: null,
        message: "E-mail niet gevonden",
      });
      return;
    }

    res.status(200).json({
      result: result.rows[0],
      message: "E-mail succesvol bijgewerkt",
    });
  } catch (err) {
    console.error(
      "Error updating flight plan:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to update flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
