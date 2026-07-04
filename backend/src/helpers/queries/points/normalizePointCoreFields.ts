import {
  POINT_CORE_COLUMNS,
  POINT_FIELD_SOURCE_KEYS,
  PointCoreColumn,
  PointCoreSource,
} from "./pointCoreColumns";

export type PointCoreNormalizeInput = {
  source: PointCoreSource;
  overrides?: Partial<Record<PointCoreColumn, unknown>>;
};

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

function resolvePointCoreColumn(input: {
  column: PointCoreColumn;
  source: PointCoreSource;
  overrides: Partial<Record<PointCoreColumn, unknown>>;
}): unknown {
  const overrideValue = input.overrides[input.column];
  if (overrideValue !== undefined) {
    return overrideValue;
  }
  return firstDefinedSourceValue(
    input.source,
    POINT_FIELD_SOURCE_KEYS[input.column]
  );
}

export function normalizePointCoreFields(
  input: PointCoreNormalizeInput
): Record<PointCoreColumn, unknown> {
  const overrides = input.overrides ?? {};
  const fields = {} as Record<PointCoreColumn, unknown>;

  for (const column of POINT_CORE_COLUMNS) {
    fields[column] = resolvePointCoreColumn({
      column,
      source: input.source,
      overrides,
    });
  }

  return fields;
}

export function pointCoreValues(input: PointCoreNormalizeInput): unknown[] {
  const fields = normalizePointCoreFields(input);
  return POINT_CORE_COLUMNS.map((column) => fields[column]);
}
