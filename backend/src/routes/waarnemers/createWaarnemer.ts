import { Request, Response } from "express";
import { pool } from "../../db";
import {
  created,
  missingFields,
  serverError,
} from "../../helpers/http/routeResponses";
import { getMissingFields } from "../../helpers/http/validateBody";
import { allocateUniquePersonId } from "../../helpers/queries/consts/slugifyPersonId";
import { resolveWritableRegioId } from "../../helpers/queries/waarnemers/assertWaarnemerRegioAccess";

export async function createWaarnemer(
  req: Request,
  res: Response
): Promise<void> {
  const { naam, regio_id } = req.body as {
    naam?: string;
    regio_id?: string;
  };

  if (getMissingFields(req.body, ["naam"]).length > 0) {
    missingFields(res);
    return;
  }

  const effectiveRegioId = resolveWritableRegioId(req, regio_id);
  if (!effectiveRegioId) {
    missingFields(res, "Regio is verplicht");
    return;
  }

  try {
    const id = await allocateUniquePersonId({
      table: "lis.waarnemers",
      naam: String(naam),
    });

    const result = await pool.query(
      `INSERT INTO lis.waarnemers (id, naam, regio_id) VALUES ($1, $2, $3) RETURNING id, naam, regio_id;`,
      [id, naam, effectiveRegioId]
    );

    created({
      res,
      result: result.rows[0],
      message: "Waarnemer succesvol aangemaakt",
    });
  } catch (err) {
    serverError({
      res,
      logLabel: "Error creating waarnemer:",
      message: `Failed to create waarnemer: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  }
}
