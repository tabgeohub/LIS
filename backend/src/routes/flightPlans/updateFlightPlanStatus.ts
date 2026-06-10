import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, okResult, serverError } from "../../helpers/routeResponses";
import { requireId } from "../../helpers/validateBody";

export async function updateFlightPlanStatus(
  req: Request,
  res: Response
): Promise<void> {
  const { id, status } = req.body;

  if (!requireId(id)) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE lis.flightPlans SET status = $1 WHERE id = $2`,
      [status, id]
    );

    okResult(
      res,
      result.rows[0],
      "Status van het vluchtplan succesvol bijgewerkt"
    );
  } catch (err) {
    serverError(
      res,
      "Fout bij het bijwerken van het vluchtplan:",
      `Bijwerken van het vluchtplan mislukt: Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
