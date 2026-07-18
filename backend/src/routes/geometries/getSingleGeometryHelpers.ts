import type { Response } from "express";
import { pool } from "../../db";

export async function fetchGeometryWithPoints(
  geometryId: string
): Promise<Record<string, unknown> | null> {
  const geometryResult = await pool.query(
    `SELECT * FROM lis.geometries WHERE id = $1`,
    [geometryId]
  );

  if (geometryResult.rows.length === 0) {
    return null;
  }

  const pointsResult = await pool.query(
    `SELECT * FROM lis.points WHERE geometry_id = $1 ORDER BY id ASC`,
    [geometryId]
  );

  return {
    ...geometryResult.rows[0],
    points: pointsResult.rows,
  };
}

export function sendGetGeometryError(res: Response, err: unknown): void {
  console.error(
    "Error fetching geometry:",
    err instanceof Error ? err.message : String(err)
  );
  res.status(500).json({
    result: null,
    message: `Failed to fetch geometry: ${
      err instanceof Error ? err.message : String(err)
    }`,
  });
}
