import { Response } from "express";
import { PoolClient } from "pg";
import { pool } from "../../db";
import { pointExistsById } from "../repositories/pointsRepo";
import {
  replaceFlightPlanPointsArray,
  selectFlightPlansOverlappingPointIds,
} from "../repositories/flightPlansRepo";

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
  if (table === "lis.points") {
    return pointExistsById(pool, id);
  }

  const result = await pool.query(
    "SELECT id FROM lis.geometries WHERE id = $1",
    [id]
  );
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

async function stripPointIdsFromFlightPlan(input: {
  client: PoolClient;
  flightPlan: { id: number; points: number[] | null };
  pointIds: number[];
}): Promise<void> {
  const currentPoints: number[] = input.flightPlan.points || [];
  const updatedPoints = currentPoints.filter(
    (pointId: number) => !input.pointIds.includes(pointId)
  );

  await replaceFlightPlanPointsArray(input.client, {
    id: input.flightPlan.id,
    points: updatedPoints,
  });
}

export async function removePointIdsFromFlightPlans(
  client: PoolClient,
  pointIds: number[]
): Promise<number> {
  if (pointIds.length === 0) {
    return 0;
  }

  const flightPlansResult = await selectFlightPlansOverlappingPointIds(
    client,
    pointIds
  );

  for (const flightPlan of flightPlansResult.rows) {
    await stripPointIdsFromFlightPlan({ client, flightPlan, pointIds });
  }

  return flightPlansResult.rowCount ?? 0;
}
