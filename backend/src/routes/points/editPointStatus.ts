import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, notFound, okResult, serverError } from "../../helpers/routeResponses";
import { requireId } from "../../helpers/validateBody";

export async function editPointStatus(
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
      `
      UPDATE lis.points SET
        status = $1
      WHERE id = $2
      RETURNING *;
    `,
      [status, id]
    );

    if (result.rows.length === 0) {
      notFound(res, "Aandachtspunt niet gevonden");
      return;
    }

    okResult(res, result.rows[0], "Aandachtspunt succesvol bijgewerkt");
  } catch (err) {
    serverError(
      res,
      "Error updating point status:",
      `Failed to update point status: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
