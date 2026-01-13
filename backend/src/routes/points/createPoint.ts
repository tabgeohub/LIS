import { Request, Response } from "express";
import { pool } from "../../db";

export async function createPoint(req: Request, res: Response): Promise<void> {
  const {
    omschrijving,
    regio_id,
    xcoordinaat_rd,
    ycoordinaat_rd,
    latitude,
    longitude,
    vertrouwelijk,
    herhalen,
    user_id,
    activiteit_id,
    organisatie_id,
    specifiek_letten_op,
  } = req.body;

  const created_at = new Date();

  if (!omschrijving || !user_id) {
    res.status(400).json({
      result: null,
      message: "Verplichte velden ontbreken.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO lis.points (
        omschrijving,
        regio_id,
        xcoordinaat_rd,
        ycoordinaat_rd,
        latitude,
        longitude,
        vertrouwelijk,
        herhalen,
        user_id,
        activiteit_id,
        organisatie_id,
        specifiek_letten_op,
        soort,
        status,
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15
      ) RETURNING *`,
      [
        omschrijving,
        regio_id,
        xcoordinaat_rd,
        ycoordinaat_rd,
        latitude,
        longitude,
        vertrouwelijk,
        herhalen,
        user_id,
        activiteit_id,
        organisatie_id,
        specifiek_letten_op,
        "permanent",
        "niet bezocht",
        created_at,
      ]
    );

    res.status(201).json({
      result: result.rows[0],
      id: result.rows[0].id,
      point: result.rows[0],
      message: "Punt succesvol aangemaakt",
    });
  } catch (err) {
    console.error(
      "Error creating point:",
      err instanceof Error ? err.message : String(err)
    );

    res.status(500).json({
      result: null,
      message: `Error : ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
