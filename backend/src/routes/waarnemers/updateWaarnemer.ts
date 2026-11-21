import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, notFound } from "../../helpers/http/routeResponses";
import { getMissingFields } from "../../helpers/http/validateBody";
import { runReturningUpdateById } from "../../helpers/http/runReturningUpdate";
import {
  forbidIfRegioMismatch,
  resolveWritableRegioId,
} from "../../helpers/queries/waarnemers/assertWaarnemerRegioAccess";
import {
  isAdminRegioValue,
  resolveRegioFilter,
} from "../../helpers/queries/shared/resolveRegioFilter";

export async function updateWaarnemer(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { naam, regio_id } = req.body as {
    naam?: string;
    regio_id?: string;
  };

  if (getMissingFields(req.body, ["naam"]).length > 0) {
    missingFields(res);
    return;
  }

  const existing = await pool.query(
    `SELECT id, naam, regio_id FROM lis.waarnemers WHERE id = $1`,
    [id]
  );

  if (existing.rows.length === 0) {
    notFound(res, "Waarnemer niet gevonden");
    return;
  }

  const sessionRegio = resolveRegioFilter(req);
  if (
    forbidIfRegioMismatch({
      res,
      sessionRegio,
      rowRegioId: existing.rows[0].regio_id,
    })
  ) {
    return;
  }

  const nextRegioId =
    sessionRegio && isAdminRegioValue(sessionRegio)
      ? resolveWritableRegioId(req, regio_id ?? existing.rows[0].regio_id)
      : existing.rows[0].regio_id;

  if (!nextRegioId) {
    missingFields(res, "Regio is verplicht");
    return;
  }

  await runReturningUpdateById({
    res,
    id,
    runQuery: () =>
      pool.query(
        `UPDATE lis.waarnemers SET naam = $1, regio_id = $2 WHERE id = $3 RETURNING id, naam, regio_id`,
        [naam, nextRegioId, id]
      ),
    config: {
      notFoundMessage: "Waarnemer niet gevonden",
      successMessage: "Waarnemer succesvol bijgewerkt",
      logLabel: "Error updating waarnemer:",
      errorMessage: "Failed to update waarnemer:",
    },
  });
}
