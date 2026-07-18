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
