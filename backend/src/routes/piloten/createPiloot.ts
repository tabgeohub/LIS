import { Request, Response } from "express";
import { pool } from "../../db";
import {
  created,
  missingFields,
  serverError,
} from "../../helpers/http/routeResponses";
import { getMissingFields } from "../../helpers/http/validateBody";
import { allocateUniquePersonId } from "../../helpers/queries/consts/slugifyPersonId";

export async function createPiloot(req: Request, res: Response): Promise<void> {
  const { naam, status } = req.body as {
    naam?: string;
    status?: string;
  };

  if (getMissingFields(req.body, ["naam", "status"]).length > 0) {
    missingFields(res);
    return;
  }

  try {
    const id = await allocateUniquePersonId({
      table: "lis.piloten",
      naam: String(naam),
    });

    const result = await pool.query(
      `INSERT INTO lis.piloten (id, naam, status) VALUES ($1, $2, $3) RETURNING id, naam, status;`,
      [id, naam, status]
    );

    created({
      res,
      result: result.rows[0],
      message: "Piloot succesvol aangemaakt",
    });
  } catch (err) {
    serverError({
      res,
      logLabel: "Error creating piloot:",
      message: `Failed to create piloot: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err,
    });
  }
}
