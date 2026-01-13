import { Request, Response } from "express";
import { pool } from "../../db";

export async function deleteFlightPlan(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Ontbrekend vluchtplan-ID" });
    return;
  }

  try {
    const result = await pool.query(
      "UPDATE lis.flightPlans SET status = 'inactief' WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Vluchtplan niet gevonden" });
      return;
    }

    res.status(200).json({
      message: "Vluchtplan succesvol verwijderd",
      deletedFlightPlan: result.rows[0],
    });
  } catch (err) {
    console.error(
      "Fout bij het verwijderen van het vluchtplan:",
      err instanceof Error ? err.message : String(err)
    );
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
}
