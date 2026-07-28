import { PointCoreColumn, PointCoreSource } from "./pointCoreColumns";
import {
  normalizePointCoreFields,
  pointCoreValues,
} from "./normalizePointCoreFields";
import { POINT_CORE_COLUMNS } from "./pointCoreColumns";

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

export type BuildPointInsertParamsInput = {
  source: PointCoreSource;
  extraValues: unknown[];
  overrides?: Partial<Record<PointCoreColumn, unknown>>;
};

export function buildPointInsertParams(input: BuildPointInsertParamsInput): unknown[] {
  const { source, extraValues, overrides = {} } = input;
  return [...pointCoreValues({ source, overrides }), ...extraValues];
}

export function buildPointUpdateParams(
  source: PointCoreSource,
  id: unknown
): unknown[] {
  const fields = normalizePointCoreFields({ source });

  return [...POINT_UPDATE_COLUMNS.map((column) => fields[column]), id];
}
