import { POINT_CORE_COLUMNS, PointCoreColumn, PointCoreSource } from "./pointCoreColumns";
import {
  normalizePointCoreFields,
  pointCoreValues,
} from "./normalizePointCoreFields";

export const POINT_UPDATE_COLUMNS: PointCoreColumn[] = [
  ...POINT_CORE_COLUMNS.slice(0, 6),
  "herhalen",
  "vertrouwelijk",
  ...POINT_CORE_COLUMNS.slice(8),
];

export function buildPointUpdateAssignments(input: {
  coalesceColumns?: PointCoreColumn[];
} = {}): string {
  const coalesceColumns = input.coalesceColumns ?? [];
  return POINT_UPDATE_COLUMNS.map((column, index) => {
    const parameter = `$${index + 1}`;
    return coalesceColumns.includes(column)
      ? `${column} = COALESCE(${parameter}, ${column})`
      : `${column} = ${parameter}`;
  }).join(",\n        ");
}

export function buildPointInsertSql(extraColumns: string[]): string {
  const columns = [...POINT_CORE_COLUMNS, ...extraColumns];
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

  return `INSERT INTO lis.points (
        ${columns.join(",\n        ")}
      ) VALUES (${placeholders})`;
}

export type BuildPointInsertParamsInput = {
  source: PointCoreSource;
  extraValues: unknown[];
  overrides?: Partial<Record<PointCoreColumn, unknown>>;
};

export function buildPointInsertParams(input: BuildPointInsertParamsInput): unknown[] {
  const { source, extraValues, overrides = {} } = input;
  return [...pointCoreValues({ source, overrides }), ...extraValues];
}

const POINT_UPDATE_SQL = `
      UPDATE lis.points SET
        ${buildPointUpdateAssignments()}
      WHERE id = $13
      RETURNING *`;

export function buildPointUpdateSql(): string {
  return POINT_UPDATE_SQL;
}

export function buildPointUpdateParams(
  source: PointCoreSource,
  id: unknown
): unknown[] {
  const fields = normalizePointCoreFields({ source });

  return [...POINT_UPDATE_COLUMNS.map((column) => fields[column]), id];
}
