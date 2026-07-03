import { Request, Response } from "express";
import { pool } from "../../db";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
  serverError,
} from "../../helpers/http/routeResponses";
import { getMissingFields, requireNonEmptyArray } from "../../helpers/http/validateBody";
import { persistNewGeometry } from "../../helpers/queries/geometries/createGeometryDb";

export async function createGeometry(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (
    getMissingFields(body, ["omschrijving", "organisatie", "geometry_type"]).length > 0 ||
    !requireNonEmptyArray(body.points)
  ) {
    missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await persistNewGeometry(client, body);
    await client.query("COMMIT");

    res.status(201).json({
      result: { geometry: result.geometry, points: result.points },
      geometry_id: result.geometryId,
      message: "Geometrie en punten succesvol aangemaakt",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    serverError({
      res,
      logLabel: "Error creating geometry:",
      message: `Error : ${err instanceof Error ? err.message : String(err)}`,
      err,
    });
  } finally {
    client.release();
  }
}
