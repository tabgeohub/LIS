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

export type PointCorePayload = Partial<Record<PointCoreColumn, unknown>>;

export type PointCoreSource = Record<string, unknown>;

/** Source keys tried in order when a column is not overridden. */
export const POINT_FIELD_SOURCE_KEYS: Record<
  PointCoreColumn,
  readonly string[]
> = {
  omschrijving: ["omschrijving"],
  regio_id: ["regio_id"],
  xcoordinaat_rd: ["xcoordinaat_rd"],
  ycoordinaat_rd: ["ycoordinaat_rd"],
  latitude: ["latitude"],
  longitude: ["longitude"],
  vertrouwelijk: ["vertrouwelijk"],
  herhalen: ["herhalen"],
  user_id: ["user_id"],
  activiteit_id: ["activiteit_id", "activiteit"],
  organisatie_id: ["organisatie_id", "organisatie"],
  specifiek_letten_op: ["specifiek_letten_op", "specifiekLettenOp"],
};
