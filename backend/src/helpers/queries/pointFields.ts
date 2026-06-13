export const POINT_CORE_COLUMNS = [
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "vertrouwelijk",
  "herhalen",
  "user_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
] as const;

export type PointCoreColumn = (typeof POINT_CORE_COLUMNS)[number];

export type PointCoreSource = Record<string, unknown>;

export function normalizePointCoreFields(
  source: PointCoreSource,
  overrides: Partial<Record<PointCoreColumn, unknown>> = {}
): Record<PointCoreColumn, unknown> {
  return {
    omschrijving: overrides.omschrijving ?? source.omschrijving,
    regio_id: overrides.regio_id ?? source.regio_id,
    xcoordinaat_rd: overrides.xcoordinaat_rd ?? source.xcoordinaat_rd,
    ycoordinaat_rd: overrides.ycoordinaat_rd ?? source.ycoordinaat_rd,
    latitude: overrides.latitude ?? source.latitude,
    longitude: overrides.longitude ?? source.longitude,
    vertrouwelijk: overrides.vertrouwelijk ?? source.vertrouwelijk,
    herhalen: overrides.herhalen ?? source.herhalen,
    user_id: overrides.user_id ?? source.user_id,
    activiteit_id:
      overrides.activiteit_id ?? source.activiteit_id ?? source.activiteit,
    organisatie_id:
      overrides.organisatie_id ?? source.organisatie_id ?? source.organisatie,
    specifiek_letten_op:
      overrides.specifiek_letten_op ??
      source.specifiek_letten_op ??
      source.specifiekLettenOp,
  };
}

export function pointCoreValues(
  source: PointCoreSource,
  overrides: Partial<Record<PointCoreColumn, unknown>> = {}
): unknown[] {
  const fields = normalizePointCoreFields(source, overrides);
  return POINT_CORE_COLUMNS.map((column) => fields[column]);
}

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
