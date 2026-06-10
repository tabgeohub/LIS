import { Request, Response } from "express";
import { pool } from "../../db";
import {
  MISSING_FIELDS_MESSAGE_WITH_PERIOD,
  missingFields,
  serverError,
} from "../../helpers/routeResponses";
import { getMissingFields } from "../../helpers/validateBody";

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

  if (getMissingFields(req.body, ["omschrijving", "user_id"]).length > 0) {
    missingFields(res, MISSING_FIELDS_MESSAGE_WITH_PERIOD);
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

    const row = result.rows[0];
    res.status(201).json({
      result: row,
      id: row.id,
      point: row,
      message: "Punt succesvol aangemaakt",
    });
  } catch (err) {
    serverError(
      res,
      "Error creating point:",
      `Error : ${err instanceof Error ? err.message : String(err)}`,
      err
    );
  }
}
