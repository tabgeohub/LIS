import { Request, Response } from "express";
import { pool } from "../../db";

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

  if (!id) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
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
      res.status(404).json({
        result: null,
        message: "Vluchtplan niet gevonden",
      });
      return;
    }

    res.status(200).json({
      result: result.rows[0],
      message: "Vluchtplan succesvol bijgewerkt",
    });
  } catch (err) {
    console.error("Error: ", err instanceof Error ? err.message : String(err));

    res.status(500).json({
      result: null,
      message: `Bijwerken van het vluchtplan mislukt. Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
