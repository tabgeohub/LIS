import { Request, Response } from "express";
import { pool } from "../../db";

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
    !vluchtnummer ||
    !waarnemer ||
    !datum ||
    !user_id ||
    !points ||
    !Array.isArray(points)
  ) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken",
    });
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

    res.status(201).json({
      result: result.rows[0],
      message: "Vluchtplan succesvol opgeslagen",
    });
  } catch (err) {
    console.error("Error creating flight plan:", err);

    res.status(500).json({
      result: null,
      message: `Failed to create flight plan: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
