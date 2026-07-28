import { Request, Response } from "express";
import { pool } from "../../db";
import { selectPointsByOmschrijving } from "../../helpers/repositories/pointsRepo";

export async function getPointsDescription(req: Request, res: Response) {
  const { omschrijving } = req.params;

  if (!omschrijving) {
    res.status(400).json({ error: "Missing omschrijving" });
    return;
  }

  try {
    const result = await selectPointsByOmschrijving(pool, omschrijving);

    res.json(result.rows.length);
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);

    res.status(500).json({
      error: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
