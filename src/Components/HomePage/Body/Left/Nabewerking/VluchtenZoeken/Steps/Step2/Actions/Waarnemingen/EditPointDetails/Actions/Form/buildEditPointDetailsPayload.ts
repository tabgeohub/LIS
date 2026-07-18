import type { FinishedPointType } from "Types/finished_plans";
import type { EditPointDetailsPayload } from "./editPointDetailsPayload";

export function buildEditPointDetailsPayload(
  selectedPoint: FinishedPointType,
  omschrijving: string,
  comment: string
): EditPointDetailsPayload {
  return {
    omschrijving,
    regio_id: selectedPoint.regio_id,
    xcoordinaat_rd: selectedPoint.xcoordinaat_rd,
    ycoordinaat_rd: selectedPoint.ycoordinaat_rd,
    latitude: selectedPoint.latitude,
    longitude: selectedPoint.longitude,
    vertrouwelijk: selectedPoint.vertrouwelijk,
    herhalen: selectedPoint.herhalen,
    user_id: selectedPoint.user_id,
    activiteit_id: selectedPoint.activiteit_id,
    organisatie_id: selectedPoint.organisatie_id,
    specifiek_letten_op: comment,
    datum: selectedPoint.datum,
    id: selectedPoint.id,
  };
}
