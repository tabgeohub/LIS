import { EnrichedPointType } from "Types";
import { pickPointCoreFields } from "./pointColumnKeys";
import type { PointCorePayloadFields } from "Types/pointCoreFields";

export type PointUpdateFormFields = PointCorePayloadFields;

export function buildPointCorePayload(input: {
  fields: PointUpdateFormFields;
  overrides?: Partial<PointUpdateFormFields>;
}) {
  return {
    ...pickPointCoreFields(input.fields),
    ...input.overrides,
  };
}

export function buildPointUpdatePayload(input: {
  fields: PointUpdateFormFields;
  id: number;
  created_at?: string;
}) {
  return {
    ...buildPointCorePayload({ fields: input.fields }),
    herhalen: input.fields.herhalen ? 1 : 0,
    datum: input.created_at,
    id: input.id,
  };
}

export function pickPointCoreLogData(point: EnrichedPointType) {
  return pickPointCoreFields(point);
}
