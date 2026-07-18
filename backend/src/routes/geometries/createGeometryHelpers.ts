import type { Response } from "express";
import type { PoolClient } from "pg";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
} from "../../helpers/http/routeResponses";
import { rollbackTransactionWithServerError } from "../../helpers/http/rollbackTransactionWithServerError";
import {
  getMissingFields,
  requireNonEmptyArray,
} from "../../helpers/http/validateBody";
import {
  persistNewGeometry,
  type CreateGeometryBody,
} from "../../helpers/queries/geometries/createGeometryDb";

export function rejectInvalidCreateGeometryBody(
  body: Record<string, unknown>,
  res: Response
): boolean {
  if (
    getMissingFields(body, ["omschrijving", "organisatie", "geometry_type"])
      .length > 0 ||
    !requireNonEmptyArray(body.points)
  ) {
    missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
    return true;
  }
  return false;
}

export async function commitAndRespondCreateGeometry(input: {
  client: PoolClient;
  body: CreateGeometryBody;
  res: Response;
}): Promise<void> {
  const { client, body, res } = input;
  await client.query("BEGIN");
  const result = await persistNewGeometry(client, body);
  await client.query("COMMIT");
  res.status(201).json({
    result: { geometry: result.geometry, points: result.points },
    geometry_id: result.geometryId,
    message: "Geometrie en punten succesvol aangemaakt",
  });
}

export async function rollbackCreateGeometryError(input: {
  client: PoolClient;
  res: Response;
  err: unknown;
}): Promise<void> {
  await rollbackTransactionWithServerError({
    ...input,
    logLabel: "Error creating geometry:",
    messagePrefix: "Error : ",
  });
}
