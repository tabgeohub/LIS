import { Request, Response } from "express";
import { pool } from "../../db";
import { buildFlightPlanQuery } from "../../helpers/queries/buildFlightPlanQuery";

export async function getFlightPlanById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const { query, params } = buildFlightPlanQuery({
      columnPreset: "byId",
      pointPreset: "byId",
      includeGeometryJoin: true,
      where: "fp.id = $1",
      params: [id],
      orderBy: "fp.id",
    });

    const result = await pool.query(query, params);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(
      "Error fetching flight plan:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Failed to fetch flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
