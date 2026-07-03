import { Request, Response } from "express";
import { pool } from "../../db";
import { runGeometryUpdateTransaction } from "../../helpers/queries/geometries/updateGeometryTransaction";

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
    await client.query("BEGIN");

    const outcome = await runGeometryUpdateTransaction({
      client,
      geometryId,
      metadata,
      points,
    });

    if (!outcome.ok) {
      await client.query("ROLLBACK");
      res.status(outcome.status).json({ result: null, message: outcome.message });
      return;
    }

    await client.query("COMMIT");
    res.status(200).json({
      result: outcome.result,
      message: "Geometrie succesvol bijgewerkt",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(
      "Error updating geometry:",
      err instanceof Error ? err.message : String(err)
    );
    res.status(500).json({
      result: null,
      message: `Error: ${err instanceof Error ? err.message : String(err)}`,
    });
  } finally {
    client.release();
  }
}
