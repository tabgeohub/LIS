import { PoolClient } from "pg";
import {
  buildPointInsertParams,
  buildPointInsertSql,
  PointCoreSource,
} from "./pointFields";

export type GeometryMetadataInput = {
  omschrijving?: unknown;
  organisatie?: unknown;
  vertrouwelijk?: unknown;
  herhalen?: unknown;
  activiteit?: unknown;
  specifiek_letten_op?: unknown;
  specifiekLettenOp?: unknown;
};

export function resolveSpecifiekLettenOp(input: GeometryMetadataInput): unknown {
  return input.specifiek_letten_op !== undefined
    ? input.specifiek_letten_op
    : input.specifiekLettenOp;
}

export function toGeometryFlag(value: unknown): number | null {
  return value !== undefined ? (value ? 1 : 0) : null;
}

export function buildGeometryMetadataValues(
  input: GeometryMetadataInput,
  geometryId: number
): unknown[] {
  return [
    input.omschrijving ?? null,
    input.organisatie ?? null,
    toGeometryFlag(input.vertrouwelijk),
    toGeometryFlag(input.herhalen),
    input.activiteit ?? null,
    resolveSpecifiekLettenOp(input) ?? null,
    geometryId,
  ];
}

export const GEOMETRY_METADATA_UPDATE_SQL = `
      UPDATE lis.geometries SET
        omschrijving = COALESCE($1, omschrijving),
        organisatie = COALESCE($2, organisatie),
        vertrouwelijk = COALESCE($3, vertrouwelijk),
        herhalen = COALESCE($4, herhalen),
        activiteit = COALESCE($5, activiteit),
        specifiek_letten_op = COALESCE($6, specifiek_letten_op)
      WHERE id = $7
      RETURNING *`;

export async function insertGeometryPoints(
  client: PoolClient,
  geometryId: number,
  points: PointCoreSource[]
): Promise<Record<string, unknown>[]> {
  const insertedPoints: Record<string, unknown>[] = [];

  for (const point of points) {
    const pointResult = await client.query(
      `${buildPointInsertSql([
        "geometry_id",
        "soort",
        "status",
        "created_at",
      ])} RETURNING *`,
      buildPointInsertParams(point, [
        geometryId,
        "permanent",
        "niet bezocht",
        new Date(),
      ])
    );
    insertedPoints.push(pointResult.rows[0]);
  }

  return insertedPoints;
}
