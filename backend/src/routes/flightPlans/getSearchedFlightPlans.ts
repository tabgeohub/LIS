import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFlightPlanQuery } from "../../helpers/queries/buildFlightPlanQuery";

export async function getSearchedFlightPlans(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const search = req.query.search as string;

    if (!search) {
      res.status(400).json({ message: "Missing search query parameter" });
      return;
    }

    const { query, params } = buildFlightPlanQuery({
      columnPreset: "search",
      pointPreset: "search",
      where:
        "LOWER(fp.vluchtnummer) LIKE LOWER($1) OR LOWER(fp.omschrijving) LIKE LOWER($1)",
      params: [`%${search}%`],
    });

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(
      "Error fetching flight plans:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch flight plans: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
