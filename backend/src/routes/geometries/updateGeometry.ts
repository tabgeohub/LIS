import { Request, Response } from "express";
import { pool } from "../../db";
import {
  buildGeometryMetadataValues,
  GEOMETRY_METADATA_UPDATE_SQL,
} from "../../helpers/queries/geometries/geometryRouteHelpers";
import { updateGeometryOwnedPoints } from "../../helpers/queries/geometries/updateGeometryPoints";

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

    const exists = await client.query(`SELECT id FROM lis.geometries WHERE id = $1`, [
      geometryId,
    ]);

    if (exists.rowCount === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ result: null, message: "Geometrie niet gevonden." });
      return;
    }

    const geometryUpdate = await client.query(
      GEOMETRY_METADATA_UPDATE_SQL,
      buildGeometryMetadataValues(metadata, geometryId)
    );

    if (points && Array.isArray(points) && points.length > 0) {
      const pointError = await updateGeometryOwnedPoints(
        client,
        geometryId,
        points
      );

      if (pointError) {
        await client.query("ROLLBACK");
        res.status(400).json({ result: null, message: pointError });
        return;
      }
    }

    const pointsResult = await client.query(
      `SELECT * FROM lis.points WHERE geometry_id = $1 ORDER BY id ASC`,
      [geometryId]
    );

    await client.query("COMMIT");

    res.status(200).json({
      result: { ...geometryUpdate.rows[0], points: pointsResult.rows },
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
