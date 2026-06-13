import { Request, Response } from "express";
import { pool } from "../../db";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
  serverError,
} from "../../helpers/routeResponses";
import { getMissingFields, requireNonEmptyArray } from "../../helpers/validateBody";
import {
  buildPointInsertParams,
  buildPointInsertSql,
} from "../../helpers/queries/pointFields";

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

    const insertedPoints = [];
    for (const point of points) {
      const pointResult = await client.query(
        `${buildPointInsertSql([
          "geometry_id",
          "soort",
          "status",
          "created_at",
        ])} RETURNING *`,
        buildPointInsertParams(point, [
          geometryId,
          "permanent",
          "niet bezocht",
          new Date(),
        ])
      );
      insertedPoints.push(pointResult.rows[0]);
    }

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
