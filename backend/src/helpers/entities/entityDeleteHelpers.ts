import { Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";

export function parseRouteEntityId(
  rawId: string | undefined,
  entityLabel: string
): number | null {
  if (!rawId) {
    return null;
  }

  const id = parseInt(rawId, 10);
  if (!Number.isFinite(id)) {
    return null;
  }

  return id;
}

export async function entityExists(
  table: "lis.points" | "lis.geometries",
  id: number
): Promise<boolean> {
  const result = await pool.query(`SELECT id FROM ${table} WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function runInTransaction<T>(
  work: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export type SendDeleteErrorInput = {
  res: Response;
  entityLabel: string;
  err: unknown;
};

export function sendDeleteError(input: SendDeleteErrorInput): void {
  const { res, entityLabel, err } = input;

  console.error(
    `Error deleting ${entityLabel}:`,
    err instanceof Error ? err.message : String(err)
  );

  res.status(500).json({
    message: `Failed to delete ${entityLabel}. Error : ${
      err instanceof Error ? err.message : String(err)
    }`,
  });
}

export async function removePointIdsFromFlightPlans(
  client: PoolClient,
  pointIds: number[]
): Promise<number> {
  if (pointIds.length === 0) {
    return 0;
  }

  const flightPlansResult = await client.query(
    `SELECT id, points FROM lis.flightplans WHERE points && $1::int[]`,
    [pointIds]
  );

  for (const flightPlan of flightPlansResult.rows) {
    const currentPoints: number[] = flightPlan.points || [];
    const updatedPoints = currentPoints.filter(
      (pointId: number) => !pointIds.includes(pointId)
    );

    await client.query(`UPDATE lis.flightplans SET points = $1::int[] WHERE id = $2`, [
      updatedPoints,
      flightPlan.id,
    ]);
  }

  return flightPlansResult.rowCount ?? 0;
}
