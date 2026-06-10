import { Request, Response } from "express";
import { pool } from "../../db";
import { created, missingFields, serverError } from "../../helpers/routeResponses";
import { getMissingFields, requireArray } from "../../helpers/validateBody";

export async function createFlightPlan(
  req: Request,
  res: Response
): Promise<void> {
  const {
    vluchtnummer,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    vliegduur,
    luchtvaartuig,
    passagiers,
    hoofdthema,
    aanvullende,
    points,
    regio_id,
    basemap,
    layers,
    user_id,
    status,
    copiedFrom,
  } = req.body;

  if (
    getMissingFields(req.body, [
      "vluchtnummer",
      "waarnemer",
      "datum",
      "user_id",
    ]).length > 0 ||
    !requireArray(points)
  ) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO lis.flightPlans (
        vluchtnummer,
        omschrijving,
        waarnemer,
        piloot,
        datum,
        vliegduur,
        luchtvaartuig,
        passagiers,
        hoofdthema,
        aanvullende,
        user_id,
        points,
        regio_id,
        basemap,
        layers,
        status,
        created_at,
        copied_from
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, NOW(), $17
      )
      RETURNING *;
    `,
      [
        vluchtnummer,
        omschrijving,
        waarnemer,
        piloot,
        datum,
        vliegduur,
        luchtvaartuig,
        passagiers,
        hoofdthema,
        aanvullende,
        user_id,
        points,
        regio_id,
        basemap,
        JSON.stringify([layers]),
        status ?? "prepared",
        copiedFrom ?? null,
      ]
    );

    created(res, result.rows[0], "Vluchtplan succesvol opgeslagen");
  } catch (err) {
    serverError(
      res,
      "Error creating flight plan:",
      `Failed to create flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
