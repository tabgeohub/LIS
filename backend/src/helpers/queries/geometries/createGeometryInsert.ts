import type { GeometryFormFields } from "../../../shared/geometryFormFields";
import type { PointCoreSource } from "../points/pointFields";

export type CreateGeometryBody = GeometryFormFields & {
  geometry_type: string;
  regio_id?: string;
  points: PointCoreSource[];
};

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
