import { Request, Response } from "express";
import { pool } from "../../db";

export async function updateFlightPlanStatus(
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
      `UPDATE lis.flightPlans SET status = $1 WHERE id = $2`,
      [status, id]
    );

    res.status(200).json({
      result: result.rows[0],
      message: "Status van het vluchtplan succesvol bijgewerkt",
    });
  } catch (err) {
    console.error(
      "Fout bij het bijwerken van het vluchtplan:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Bijwerken van het vluchtplan mislukt: Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
