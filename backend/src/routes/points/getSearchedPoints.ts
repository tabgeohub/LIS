import { Request, Response } from "express";
import { pool } from "../../db";
import { buildPointSearchQuery } from "../../helpers/queries/points/buildPointSearchQuery";

export async function getSearchedPoints(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { omschrijving } = req.params;

    const result = await pool.query(buildPointSearchQuery("omschrijving"), [
      `%${omschrijving}%`,
    ]);

    res.json(result.rows[0].points || []);
  } catch (err) {
    console.error(
      "Error fetching searched points:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      error: `Error fetching searched points: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
