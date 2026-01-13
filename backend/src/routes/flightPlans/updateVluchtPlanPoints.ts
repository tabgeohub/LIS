import { Request, Response } from "express";
import { pool } from "../../db";

export async function updateVluchtPlanPoints(
  req: Request,
  res: Response
): Promise<void> {
  const { points, id } = req.body;

  if (!id) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE lis.flightPlans SET points = $1 WHERE id = $2 RETURNING *;`,
      [points, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        result: null,
        message: "Vluchtplan niet gevonden",
      });
      return;
    }

    res.status(200).json({
      result: result.rows[0],
      message: "Vluchtplan succesvol bijgewerkt",
    });
  } catch (err) {
    console.error(
      "Error updating flight plan points:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Bijwerken van het vluchtplan is misluktn. Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
