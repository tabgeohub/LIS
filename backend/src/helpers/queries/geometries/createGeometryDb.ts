import { PoolClient } from "pg";
import { insertGeometryPoints } from "./geometryRouteHelpers";
import type { PointCoreSource } from "../points/pointFields";

export type CreateGeometryBody = {
  omschrijving: string;
  organisatie: string;
  vertrouwelijk?: boolean;
  herhalen?: boolean;
  activiteit?: string;
  specifiekLettenOp?: string;
  geometry_type: string;
  regio_id?: string;
  points: PointCoreSource[];
};

export async function persistNewGeometry(
  client: PoolClient,
  body: CreateGeometryBody
) {
  const geometryResult = await client.query(
    `INSERT INTO lis.geometries (
      omschrijving,
      organisatie,
      vertrouwelijk,
      herhalen,
      activiteit,
      specifiek_letten_op,
      type,
      regio_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [
      body.omschrijving,
      body.organisatie,
      body.vertrouwelijk ? 1 : 0,
      body.herhalen ? 1 : 0,
      body.activiteit,
      body.specifiekLettenOp,
      body.geometry_type,
      body.regio_id,
    ]
  );

  const geometryId = geometryResult.rows[0].id;
  const insertedPoints = await insertGeometryPoints({
    client,
    geometryId,
    points: body.points,
  });

  return { geometryId, geometry: geometryResult.rows[0], points: insertedPoints };
}
