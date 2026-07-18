import { POINT_CORE_PAYLOAD_FIELDS } from "./pointCoreFieldKeys";

export { POINT_CORE_PAYLOAD_FIELDS };

type PointCorePayloadField = (typeof POINT_CORE_PAYLOAD_FIELDS)[number];

export function pickPointCoreFields<
  T extends { [K in PointCorePayloadField]: unknown }
>(source: T): Pick<T, PointCorePayloadField> {
  return Object.fromEntries(
    POINT_CORE_PAYLOAD_FIELDS.map((field) => [field, source[field]])
  ) as Pick<T, PointCorePayloadField>;
}
