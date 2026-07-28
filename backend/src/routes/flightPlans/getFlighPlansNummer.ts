import { Request, Response } from "express";
import { pool } from "../../db";
import { selectFlightPlansByVluchtnummer } from "../../helpers/repositories/flightPlansRepo";

export async function getFlighPlansNummer(req: Request, res: Response) {
  const { vluchtnummer } = req.params;

  if (!vluchtnummer) {
    res.status(400).json({ error: "Missing vluchtnummer" });
    return;
  }

  try {
    const result = await selectFlightPlansByVluchtnummer(pool, vluchtnummer);

    res.json(result.rows.length);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : String(err) });
  }
}
