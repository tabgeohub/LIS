export type GeometryMetadataInput = {
  omschrijving?: unknown;
  organisatie?: unknown;
  vertrouwelijk?: unknown;
  herhalen?: unknown;
  activiteit?: unknown;
  specifiek_letten_op?: unknown;
  specifiekLettenOp?: unknown;
};

export function resolveSpecifiekLettenOp(input: GeometryMetadataInput): unknown {
  return input.specifiek_letten_op !== undefined
    ? input.specifiek_letten_op
    : input.specifiekLettenOp;
}

export function toGeometryFlag(value: unknown): number | null {
  return value !== undefined ? (value ? 1 : 0) : null;
}

function coalesceNull(value: unknown): unknown {
  return value ?? null;
}

export function buildGeometryMetadataValues(
  input: GeometryMetadataInput,
  geometryId: number
): unknown[] {
  return [
    coalesceNull(input.omschrijving),
    coalesceNull(input.organisatie),
    toGeometryFlag(input.vertrouwelijk),
    toGeometryFlag(input.herhalen),
    coalesceNull(input.activiteit),
    coalesceNull(resolveSpecifiekLettenOp(input)),
    geometryId,
  ];
}
