import { Request, Response } from "express";
import { pool } from "../../db";
import type { PointCorePayload } from "../../helpers/queries/pointFields";
import {
  buildGeometryMetadataValues,
  GEOMETRY_METADATA_UPDATE_SQL,
} from "../../helpers/queries/geometryRouteHelpers";

type PointPayload = PointCorePayload & { id?: number };

export async function updateGeometry(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const geometryId = parseInt(id, 10);

  if (!Number.isFinite(geometryId)) {
    res.status(400).json({
      result: null,
      message: "Ongeldige geometrie-id.",
    });
    return;
  }

  const { points, ...metadata } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const exists = await client.query(
      `SELECT id FROM lis.geometries WHERE id = $1`,
      [geometryId]
    );

    if (exists.rowCount === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({
        result: null,
        message: "Geometrie niet gevonden.",
      });
      return;
    }

    const geometryUpdate = await client.query(
      GEOMETRY_METADATA_UPDATE_SQL,
      buildGeometryMetadataValues(metadata, geometryId)
    );

    const geometryRow = geometryUpdate.rows[0];

    if (points && Array.isArray(points) && points.length > 0) {
      for (const raw of points as PointPayload[]) {
        if (raw.id == null) continue;

        const pointId = Number(raw.id);
        if (!Number.isFinite(pointId)) continue;

        const owner = await client.query(
          `SELECT id FROM lis.points WHERE id = $1 AND geometry_id = $2`,
          [pointId, geometryId]
        );

        if (owner.rowCount === 0) {
          await client.query("ROLLBACK");
          res.status(400).json({
            result: null,
            message: `Punt ${pointId} hoort niet bij deze geometrie.`,
          });
          return;
        }

        await client.query(
          `UPDATE lis.points SET
            omschrijving = $1,
            regio_id = $2,
            xcoordinaat_rd = $3,
            ycoordinaat_rd = $4,
            latitude = $5,
            longitude = $6,
            herhalen = $7,
            vertrouwelijk = $8,
            user_id = COALESCE($9, user_id),
            activiteit_id = $10,
            organisatie_id = $11,
            specifiek_letten_op = $12
          WHERE id = $13 AND geometry_id = $14`,
          [
            raw.omschrijving,
            raw.regio_id,
            raw.xcoordinaat_rd,
            raw.ycoordinaat_rd,
            raw.latitude,
            raw.longitude,
            raw.herhalen,
            raw.vertrouwelijk,
            raw.user_id,
            raw.activiteit_id,
            raw.organisatie_id,
            raw.specifiek_letten_op,
            pointId,
            geometryId,
          ]
        );
      }
    }

    const pointsResult = await client.query(
      `SELECT * FROM lis.points WHERE geometry_id = $1 ORDER BY id ASC`,
      [geometryId]
    );

    await client.query("COMMIT");

    res.status(200).json({
      result: {
        ...geometryRow,
        points: pointsResult.rows,
      },
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
