import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, notFound, okResult, serverError } from "../../helpers/routeResponses";
import { requireId } from "../../helpers/validateBody";

export async function deleteSingleEmail(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  if (!requireId(id)) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `DELETE FROM lis.emails WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      notFound(res, "E-mail niet gevonden");
      return;
    }

    okResult({
      res,
      result: result.rows[0],
      message: "E-mail succesvol verwijderd",
    });
  } catch (err) {
    serverError({
      res,
      logLabel: "Error deleting email:",
      message: `Failed to delete email: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  }
}
