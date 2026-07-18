import { PoolClient } from "pg";
import { insertGeometryPoints } from "./geometryRouteHelpers";
import {
  buildCreateGeometryParams,
  CREATE_GEOMETRY_SQL,
  type CreateGeometryBody,
} from "./createGeometryInsert";

export type { CreateGeometryBody };

export async function persistNewGeometry(
  client: PoolClient,
  body: CreateGeometryBody
) {
  const geometryResult = await client.query(
    CREATE_GEOMETRY_SQL,
    buildCreateGeometryParams(body)
  );

  const geometryId = geometryResult.rows[0].id;
  const insertedPoints = await insertGeometryPoints({
    client,
    geometryId,
    points: body.points,
  });

  return { geometryId, geometry: geometryResult.rows[0], points: insertedPoints };
}
