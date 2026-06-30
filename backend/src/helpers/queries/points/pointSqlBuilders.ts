import { POINT_CORE_COLUMNS, PointCoreColumn, PointCoreSource } from "./pointCoreColumns";
import {
  normalizePointCoreFields,
  pointCoreValues,
} from "./normalizePointCoreFields";

export function buildPointInsertSql(extraColumns: string[]): string {
  const columns = [...POINT_CORE_COLUMNS, ...extraColumns];
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

  return `INSERT INTO lis.points (
        ${columns.join(",\n        ")}
      ) VALUES (${placeholders})`;
}

export function buildPointInsertParams(
  source: PointCoreSource,
  extraValues: unknown[],
  overrides: Partial<Record<PointCoreColumn, unknown>> = {}
): unknown[] {
  return [...pointCoreValues(source, overrides), ...extraValues];
}

const POINT_UPDATE_SQL = `
      UPDATE lis.points SET
        omschrijving = $1,
        regio_id = $2,
        xcoordinaat_rd = $3,
        ycoordinaat_rd = $4,
        latitude = $5,
        longitude = $6,
        herhalen = $7,
        vertrouwelijk = $8,
        user_id = $9,
        activiteit_id = $10,
        organisatie_id = $11,
        specifiek_letten_op = $12
      WHERE id = $13
      RETURNING *`;

export function buildPointUpdateSql(): string {
  return POINT_UPDATE_SQL;
}

export function buildPointUpdateParams(
  source: PointCoreSource,
  id: unknown
): unknown[] {
  const fields = normalizePointCoreFields(source);

  return [
    fields.omschrijving,
    fields.regio_id,
    fields.xcoordinaat_rd,
    fields.ycoordinaat_rd,
    fields.latitude,
    fields.longitude,
    fields.herhalen,
    fields.vertrouwelijk,
    fields.user_id,
    fields.activiteit_id,
    fields.organisatie_id,
    fields.specifiek_letten_op,
    id,
  ];
}
