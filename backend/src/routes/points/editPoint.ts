import { Request, Response } from "express";
import { pool } from "../../db";
import { missingFields, notFound, okResult, serverError } from "../../helpers/routeResponses";
import { requireId } from "../../helpers/validateBody";

export async function editPoint(req: Request, res: Response): Promise<void> {
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
    id,
  } = req.body;

  if (!requireId(id)) {
    missingFields(res);
    return;
  }

  try {
    const result = await pool.query(
      `
      UPDATE lis.points SET
        omschrijving = $1,
        regio_id = $2,
        xcoordinaat_rd = $3,
        ycoordinaat_rd = $4,
        latitude = $5,
        longitude = $6,
        herhalen = $7,
        vertrouwelijk = $8,
        user_id = $9,
        activiteit_id = $10,
        organisatie_id = $11,
        specifiek_letten_op = $12
      WHERE id = $13
      RETURNING *;
    `,
      [
        omschrijving,
        regio_id,
        xcoordinaat_rd,
        ycoordinaat_rd,
        latitude,
        longitude,
        herhalen,
        vertrouwelijk,
        user_id,
        activiteit_id,
        organisatie_id,
        specifiek_letten_op,
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
      "Error updating point:",
      `Failed to update point: ${
        err instanceof Error ? err.message : String(err)
      }`,
      err
    );
  }
}
