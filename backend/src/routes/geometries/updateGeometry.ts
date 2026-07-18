import { Request, Response } from "express";
import { pool } from "../../db";
import {
  commitGeometryUpdate,
  rollbackGeometryUpdateError,
} from "./updateGeometryHelpers";

export async function updateGeometry(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const geometryId = parseInt(id, 10);

  if (!Number.isFinite(geometryId)) {
    res.status(400).json({ result: null, message: "Ongeldige geometrie-id." });
    return;
  }

  const { points, ...metadata } = req.body;
  const client = await pool.connect();

  try {
    await commitGeometryUpdate({
      client,
      res,
      geometryId,
      metadata,
      points: Array.isArray(points) ? points : undefined,
    });
  } catch (err) {
    await rollbackGeometryUpdateError({ client, res, err });
  } finally {
    client.release();
  }
}
