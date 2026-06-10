import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, notFound, okResult, serverError } from "../../helpers/routeResponses";
import { requireId } from "../../helpers/validateBody";

export async function updateVluchtPlanPoints(
  req: Request,
  res: Response
): Promise<void> {
  const { points, id } = req.body;

  if (!requireId(id)) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE lis.flightPlans SET points = $1 WHERE id = $2 RETURNING *;`,
      [points, id]
    );

    if (result.rows.length === 0) {
      notFound(res, "Vluchtplan niet gevonden");
      return;
    }

    okResult(res, result.rows[0], "Vluchtplan succesvol bijgewerkt");
  } catch (err) {
    serverError(
      res,
      "Error updating flight plan points:",
      `Bijwerken van het vluchtplan is misluktn. Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
