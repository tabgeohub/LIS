import { Request, Response } from "express";
import { pool } from "../../db";
import { notFound } from "../../helpers/http/routeResponses";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";
import { forbidIfRegioMismatch } from "../../helpers/queries/waarnemers/assertWaarnemerRegioAccess";
import { resolveRegioFilter } from "../../helpers/queries/shared/resolveRegioFilter";

export async function deleteWaarnemer(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const existing = await pool.query(
    `SELECT id, regio_id FROM lis.waarnemers WHERE id = $1`,
    [id]
  );

  if (existing.rows.length === 0) {
    notFound(res, "Waarnemer niet gevonden");
    return;
  }

  if (
    forbidIfRegioMismatch({
      res,
      sessionRegio: resolveRegioFilter(req),
      rowRegioId: existing.rows[0].regio_id,
    })
  ) {
    return;
  }

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(
        `DELETE FROM lis.waarnemers WHERE id = $1 RETURNING id, naam, regio_id`,
        [id]
      ),
    config: {
      notFoundMessage: "Waarnemer niet gevonden",
      successMessage: "Waarnemer succesvol verwijderd",
      logLabel: "Error deleting waarnemer:",
      errorMessage: "Failed to delete waarnemer:",
    },
  });
}
