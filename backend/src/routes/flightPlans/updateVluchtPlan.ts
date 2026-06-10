import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, notFound, okResult, serverError } from "../../helpers/routeResponses";
import { requireId } from "../../helpers/validateBody";

export async function updateVluchtPlan(
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
    user_id,
    status,
    id,
  } = req.body;

  if (!requireId(id)) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `
      UPDATE lis.flightPlans SET
        vluchtnummer = $1,
        omschrijving = $2,
        waarnemer = $3,
        piloot = $4,
        datum = $5,
        vliegduur = $6,
        luchtvaartuig = $7,
        passagiers = $8,
        hoofdthema = $9,
        aanvullende = $10,
        points = $11,
        status = $12
      WHERE id = $13
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
        points,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      notFound(res, "Vluchtplan niet gevonden");
      return;
    }

    okResult(res, result.rows[0], "Vluchtplan succesvol bijgewerkt");
  } catch (err) {
    serverError(
      res,
      "Error:",
      `Bijwerken van het vluchtplan mislukt. Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
