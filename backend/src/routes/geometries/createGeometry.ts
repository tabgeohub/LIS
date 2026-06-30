import { Request, Response } from "express";
import { pool } from "../../db";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
  serverError,
} from "../../helpers/routeResponses";
import { getMissingFields, requireNonEmptyArray } from "../../helpers/validateBody";
import { insertGeometryPoints } from "../../helpers/queries/geometries/geometryRouteHelpers";
import type { PointCoreSource } from "../../helpers/queries/points/pointFields";

export async function createGeometry(req: Request, res: Response): Promise<void> {
  const {
    omschrijving,
    organisatie,
    vertrouwelijk,
    herhalen,
    activiteit,
    specifiekLettenOp,
    geometry_type,
    regio_id,
    points,
  } = req.body;

  if (
    getMissingFields(req.body, ["omschrijving", "organisatie", "geometry_type"])
      .length > 0 ||
    !requireNonEmptyArray(points)
  ) {
    missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const geometryResult = await client.query(
      `INSERT INTO lis.geometries (
        omschrijving,
        organisatie,
        vertrouwelijk,
        herhalen,
        activiteit,
        specifiek_letten_op,
        type,
        regio_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        omschrijving,
        organisatie,
        vertrouwelijk ? 1 : 0,
        herhalen ? 1 : 0,
        activiteit,
        specifiekLettenOp,
        geometry_type,
        regio_id,
      ]
    );

    const geometryId = geometryResult.rows[0].id;
    const insertedPoints = await insertGeometryPoints(
      client,
      geometryId,
      points as PointCoreSource[]
    );

    await client.query("COMMIT");

    res.status(201).json({
      result: {
        geometry: geometryResult.rows[0],
        points: insertedPoints,
      },
      geometry_id: geometryId,
      message: "Geometrie en punten succesvol aangemaakt",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    serverError(
      res,
      "Error creating geometry:",
      `Error : ${err instanceof Error ? err.message : String(err)}`,
      err
    );
  } finally {
    client.release();
  }
}
