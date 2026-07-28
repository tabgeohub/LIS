import { PoolClient } from "pg";
import {
  insertPointReturningRow,
  type PointInsertInput,
} from "../../repositories/pointsRepo";
import type { PointCoreSource } from "../points/pointFields";

export type {
  GeometryMetadataInput,
} from "./geometryMetadataValues";
export {
  resolveSpecifiekLettenOp,
  toGeometryFlag,
  buildGeometryMetadataValues,
} from "./geometryMetadataValues";

/** @deprecated SQL lives in geometriesRepo — re-export for callers that still import the constant. */
export {
  GEOMETRY_METADATA_UPDATE_SQL,
} from "../../repositories/geometriesRepo";

export type InsertGeometryPointsInput = {
  client: PoolClient;
  geometryId: number;
  points: PointCoreSource[];
};

export async function insertGeometryPoints(
  input: InsertGeometryPointsInput
): Promise<Record<string, unknown>[]> {
  const { client, geometryId, points } = input;
  const insertedPoints: Record<string, unknown>[] = [];

  for (const point of points) {
    const pointResult = await insertPointReturningRow(client, {
      source: point as PointInsertInput["source"],
      extraColumns: ["geometry_id", "soort", "status", "created_at"],
      extraValues: [geometryId, "permanent", "niet bezocht", new Date()],
    });
    insertedPoints.push(pointResult.rows[0]);
  }

  return insertedPoints;
}
