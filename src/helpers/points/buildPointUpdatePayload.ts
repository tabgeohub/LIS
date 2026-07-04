import { EnrichedPointType } from "Types";

export type PointUpdateFormFields = {
  omschrijving: string;
  regio_id: string;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
  vertrouwelijk: number;
  herhalen: boolean | number;
  user_id: number;
  activiteit_id: string;
  organisatie_id: string;
  specifiek_letten_op: string;
};

export function buildPointUpdatePayload(input: {
  fields: PointUpdateFormFields;
  id: number;
  created_at?: string;
}) {
  return {
    omschrijving: input.fields.omschrijving,
    regio_id: input.fields.regio_id,
    xcoordinaat_rd: input.fields.xcoordinaat_rd,
    ycoordinaat_rd: input.fields.ycoordinaat_rd,
    latitude: input.fields.latitude,
    longitude: input.fields.longitude,
    vertrouwelijk: input.fields.vertrouwelijk,
    herhalen: input.fields.herhalen ? 1 : 0,
    user_id: input.fields.user_id,
    activiteit_id: input.fields.activiteit_id,
    organisatie_id: input.fields.organisatie_id,
    specifiek_letten_op: input.fields.specifiek_letten_op,
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
