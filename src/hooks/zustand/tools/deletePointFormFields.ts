import type { DeletePoint } from "./deletePointStateTypes";

export type DeletePointFormFields = Pick<
  DeletePoint,
  | "omschrijving"
  | "regio_id"
  | "xcoordinaat_rd"
  | "ycoordinaat_rd"
  | "latitude"
  | "longitude"
  | "vertrouwelijk"
  | "herhalen"
  | "user_id"
  | "activiteit_id"
  | "organisatie_id"
  | "specifiek_letten_op"
>;

export function pickDeletePointFormFields(
  state: DeletePoint
): DeletePointFormFields {
  return {
    omschrijving: state.omschrijving,
    regio_id: state.regio_id,
    xcoordinaat_rd: state.xcoordinaat_rd,
    ycoordinaat_rd: state.ycoordinaat_rd,
    latitude: state.latitude,
    longitude: state.longitude,
    vertrouwelijk: state.vertrouwelijk,
    herhalen: state.herhalen,
    user_id: state.user_id,
    activiteit_id: state.activiteit_id,
    organisatie_id: state.organisatie_id,
    specifiek_letten_op: state.specifiek_letten_op,
  };
}

export type DeletePointCoordinateFields = Pick<
  DeletePoint,
  | "xcoordinaat_rd"
  | "ycoordinaat_rd"
  | "latitude"
  | "longitude"
  | "setXCoordinaat_rd"
  | "setYCoordinaat_rd"
  | "setLatitude"
  | "setLongitude"
>;

export function pickDeletePointCoordinateFields(
  state: DeletePoint
): DeletePointCoordinateFields {
  return {
    xcoordinaat_rd: state.xcoordinaat_rd,
    ycoordinaat_rd: state.ycoordinaat_rd,
    latitude: state.latitude,
    longitude: state.longitude,
    setXCoordinaat_rd: state.setXCoordinaat_rd,
    setYCoordinaat_rd: state.setYCoordinaat_rd,
    setLatitude: state.setLatitude,
    setLongitude: state.setLongitude,
  };
}
