import {
  POINT_CORE_COLUMNS,
  POINT_FIELD_SOURCE_KEYS,
  PointCoreColumn,
  PointCoreSource,
} from "./pointCoreColumns";

function firstDefinedSourceValue(
  source: PointCoreSource,
  keys: readonly string[]
): unknown {
  for (const key of keys) {
    if (source[key] !== undefined) {
      return source[key];
    }
  }
  return undefined;
}

function resolvePointCoreColumn(
  column: PointCoreColumn,
  source: PointCoreSource,
  overrides: Partial<Record<PointCoreColumn, unknown>>
): unknown {
  const overrideValue = overrides[column];
  if (overrideValue !== undefined) {
    return overrideValue;
  }
  return firstDefinedSourceValue(source, POINT_FIELD_SOURCE_KEYS[column]);
}

export function normalizePointCoreFields(
  source: PointCoreSource,
  overrides: Partial<Record<PointCoreColumn, unknown>> = {}
): Record<PointCoreColumn, unknown> {
  const fields = {} as Record<PointCoreColumn, unknown>;

  for (const column of POINT_CORE_COLUMNS) {
    fields[column] = resolvePointCoreColumn(column, source, overrides);
  }

  return fields;
}

export function pointCoreValues(
  source: PointCoreSource,
  overrides: Partial<Record<PointCoreColumn, unknown>> = {}
): unknown[] {
  const fields = normalizePointCoreFields(source, overrides);
  return POINT_CORE_COLUMNS.map((column) => fields[column]);
}
