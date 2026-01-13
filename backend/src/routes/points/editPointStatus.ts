import { Request, Response } from "express";
import { pool } from "../../db";

export async function editPointStatus(
  req: Request,
  res: Response
): Promise<void> {
  const { id, status } = req.body;

  if (!id) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
    return;
  }

  try {
    const result = await pool.query(
      `
      UPDATE lis.points SET
        status = $1
      WHERE id = $2
      RETURNING *;
    `,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        result: null,
        message: "Aandachtspunt niet gevonden",
      });
      return;
    }

    res.status(200).json({
      result: result.rows[0],
      message: "Aandachtspunt succesvol bijgewerkt",
    });
  } catch (err) {
    console.error(
      `Error updating point status:`,
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Failed to update point status: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
