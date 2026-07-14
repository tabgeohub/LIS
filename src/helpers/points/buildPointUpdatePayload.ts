import { EnrichedPointType } from "Types";
import { pickPointCoreFields } from "./pointColumnKeys";

export type PointUpdateFormFields = {
  omschrijving: string;
  regio_id: string;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
  vertrouwelijk: boolean | number | string;
  herhalen: boolean | number | string;
  user_id: number;
  activiteit_id: string;
  organisatie_id: string;
  specifiek_letten_op: string;
};

export function buildPointCorePayload(
  fields: PointUpdateFormFields,
  overrides: Partial<PointUpdateFormFields> = {}
) {
  return {
    ...pickPointCoreFields(fields),
    ...overrides,
  };
}

export function buildPointUpdatePayload(input: {
  fields: PointUpdateFormFields;
  id: number;
  created_at?: string;
}) {
  return {
    ...buildPointCorePayload(input.fields),
    herhalen: input.fields.herhalen ? 1 : 0,
    datum: input.created_at,
    id: input.id,
  };
}

export function pickPointCoreLogData(point: EnrichedPointType) {
  return pickPointCoreFields(point);
}
