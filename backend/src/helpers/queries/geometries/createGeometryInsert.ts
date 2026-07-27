import type { PointCoreSource } from "../points/pointFields";
import type { GeometryFormFields } from "../../../shared/geometryFormFields";

export type CreateGeometryBody = GeometryFormFields & {
  geometry_type: string;
  regio_id?: string;
  points: PointCoreSource[];
};

export const CREATE_GEOMETRY_SQL = `INSERT INTO lis.geometries (
      omschrijving,
      organisatie,
      vertrouwelijk,
      herhalen,
      activiteit,
      specifiek_letten_op,
      type,
      regio_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;

export function buildCreateGeometryParams(body: CreateGeometryBody): unknown[] {
  return [
    body.omschrijving,
    body.organisatie,
    body.vertrouwelijk ? 1 : 0,
    body.herhalen ? 1 : 0,
    body.activiteit,
    body.specifiekLettenOp,
    body.geometry_type,
    body.regio_id,
  ];
}
