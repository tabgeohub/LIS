import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, notFound, okResult, serverError } from "../../helpers/http/routeResponses";
import { requireId } from "../../helpers/http/validateBody";

export async function editSingleEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { id, email } = req.body;

  if (!requireId(id)) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE lis.emails SET email = $1 WHERE id = $2 RETURNING *`,
      [email, Number(id)]
    );

    if (result.rows.length === 0) {
      notFound(res, "E-mail niet gevonden");
      return;
    }

    okResult({
      res,
      result: result.rows[0],
      message: "E-mail succesvol bijgewerkt",
    });
  } catch (err) {
    serverError({
      res,
      logLabel: "Error updating flight plan:",
      message: `Failed to update flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  }
}
