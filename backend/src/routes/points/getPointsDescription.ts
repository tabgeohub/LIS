import { Request, Response } from "express";
import { pool } from "../../db";

export async function getPointsDescription(req: Request, res: Response) {
  const { omschrijving } = req.params;

  if (!omschrijving) {
    res.status(400).json({ error: "Missing omschrijving" });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT * FROM lis.points WHERE omschrijving = $1",
      [omschrijving]
    );

    res.json(result.rows.length);
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);

    res
      .status(500)
      .json({
        error: `Error: ${err instanceof Error ? err.message : String(err)}`,
      });
  }
}
