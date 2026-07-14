export const POINT_CORE_DISPLAY_COLUMNS = [
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "herhalen",
  "vertrouwelijk",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;

export const POINT_EXPORT_COLUMNS = [
  "geometry",
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "herhalen",
  "vertrouwelijk",
  "indiener_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;

export const POINT_CORE_PAYLOAD_FIELDS = [
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

type PointCorePayloadField = (typeof POINT_CORE_PAYLOAD_FIELDS)[number];

export function pickPointCoreFields<
  T extends { [K in PointCorePayloadField]: unknown }
>(source: T): Pick<T, PointCorePayloadField> {
  return Object.fromEntries(
    POINT_CORE_PAYLOAD_FIELDS.map((field) => [field, source[field]])
  ) as Pick<T, PointCorePayloadField>;
}

export type PointImportRow = {
  omschrijving: string;
  regio_id: string;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
  herhalen: number | string | boolean;
  vertrouwelijk: number | string | boolean;
  user_id: string;
  activiteit_id: string;
  organisatie_id: string;
  specifiek_letten_op: string;
};
