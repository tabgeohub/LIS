import type { PointCoreIdentityFields } from "Types/pointCoreFields";

/** Shared zeroed RD/WGS coordinate fields for empty point defaults. */
export const EMPTY_POINT_COORDINATES = {
  xcoordinaat_rd: 0,
  ycoordinaat_rd: 0,
  latitude: 0,
  longitude: 0,
} as const satisfies Pick<
  PointCoreIdentityFields,
  "xcoordinaat_rd" | "ycoordinaat_rd" | "latitude" | "longitude"
>;

/** Shared empty identity fields (blank text + zeroed coordinates). */
export const EMPTY_POINT_IDENTITY_FIELDS: PointCoreIdentityFields = {
  omschrijving: "",
  regio_id: "",
  ...EMPTY_POINT_COORDINATES,
};

/** Shared numeric flags used by import rows and popup initial state. */
export const EMPTY_POINT_NUMERIC_FLAGS = {
  herhalen: 0,
  vertrouwelijk: 0,
} as const;
