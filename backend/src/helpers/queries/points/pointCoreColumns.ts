/** Shared point column keys for SQL builders and geometry JSON presets. */

import { POINT_CORE_IDENTITY_KEYS } from "../../../shared/pointCoreKeys";

export { POINT_CORE_IDENTITY_KEYS };

export const POINT_CORE_ORG_KEYS = [
  "user_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
] as const;

export const POINT_CORE_COLUMNS = [
  ...POINT_CORE_IDENTITY_KEYS,
  "vertrouwelijk",
  "herhalen",
  ...POINT_CORE_ORG_KEYS,
] as const;

/** Display-order keys used in geometry points JSON (herhalen before vertrouwelijk). */
export const GEOMETRY_POINT_CORE_KEYS = [
  ...POINT_CORE_IDENTITY_KEYS,
  "herhalen",
  "vertrouwelijk",
  ...POINT_CORE_ORG_KEYS,
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
