import { PoolClient } from "pg";
import { insertGeometryPoints } from "./geometryRouteHelpers";
import type { CreateGeometryBody } from "./createGeometryInsert";
import { insertGeometryReturningId } from "../../repositories/geometriesRepo";

export type { CreateGeometryBody };

export async function persistNewGeometry(
  client: PoolClient,
  body: CreateGeometryBody
) {
  const geometryResult = await insertGeometryReturningId(client, body);

  const geometryId = geometryResult.rows[0].id;
  const insertedPoints = await insertGeometryPoints({
    client,
    geometryId,
    points: body.points,
  });

  return { geometryId, geometry: geometryResult.rows[0], points: insertedPoints };
}
