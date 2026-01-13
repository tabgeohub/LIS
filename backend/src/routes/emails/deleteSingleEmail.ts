import { Request, Response } from "express";
import { pool } from "../../db";

export async function deleteSingleEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
    return;
  }

  try {
    const result = await pool.query(
      `DELETE FROM lis.emails WHERE id = $1 RETURNING *`,
      [id]
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
      message: "E-mail succesvol verwijderd",
    });
  } catch (err) {
    console.error(
      "Error deleting email:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to delete email: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
