import { EnrichedPointType } from "Types";

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
    omschrijving: fields.omschrijving,
    regio_id: fields.regio_id,
    xcoordinaat_rd: fields.xcoordinaat_rd,
    ycoordinaat_rd: fields.ycoordinaat_rd,
    latitude: fields.latitude,
    longitude: fields.longitude,
    vertrouwelijk: fields.vertrouwelijk,
    herhalen: fields.herhalen,
    user_id: fields.user_id,
    activiteit_id: fields.activiteit_id,
    organisatie_id: fields.organisatie_id,
    specifiek_letten_op: fields.specifiek_letten_op,
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
  return {
    omschrijving: point.omschrijving,
    regio_id: point.regio_id,
    xcoordinaat_rd: point.xcoordinaat_rd,
    ycoordinaat_rd: point.ycoordinaat_rd,
    latitude: point.latitude,
    longitude: point.longitude,
    vertrouwelijk: point.vertrouwelijk,
    herhalen: point.herhalen,
    user_id: point.user_id,
    activiteit_id: point.activiteit_id,
    organisatie_id: point.organisatie_id,
    specifiek_letten_op: point.specifiek_letten_op,
  };
}
