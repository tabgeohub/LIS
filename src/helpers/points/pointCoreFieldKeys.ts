/** Shared point column key lists used by display, payload, and export helpers. */

export const POINT_CORE_IDENTITY_KEYS = [
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
] as const;

export const POINT_CORE_PAYLOAD_FIELDS = [
  ...POINT_CORE_IDENTITY_KEYS,
  "vertrouwelijk",
  "herhalen",
  "user_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
] as const;

export const POINT_CORE_DISPLAY_COLUMNS = [
  ...POINT_CORE_IDENTITY_KEYS,
  "herhalen",
  "vertrouwelijk",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;

export const POINT_EXPORT_COLUMNS = [
  "geometry",
  ...POINT_CORE_IDENTITY_KEYS,
  "herhalen",
  "vertrouwelijk",
  "indiener_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;
