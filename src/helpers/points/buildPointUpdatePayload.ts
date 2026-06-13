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

export function buildPointUpdatePayload(
  fields: PointUpdateFormFields,
  id: number,
  created_at?: string
) {
  return {
    omschrijving: fields.omschrijving,
    regio_id: fields.regio_id,
    xcoordinaat_rd: fields.xcoordinaat_rd,
    ycoordinaat_rd: fields.ycoordinaat_rd,
    latitude: fields.latitude,
    longitude: fields.longitude,
    vertrouwelijk: fields.vertrouwelijk,
    herhalen: fields.herhalen ? 1 : 0,
    user_id: fields.user_id,
    activiteit_id: fields.activiteit_id,
    organisatie_id: fields.organisatie_id,
    specifiek_letten_op: fields.specifiek_letten_op,
    datum: created_at,
    id,
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
