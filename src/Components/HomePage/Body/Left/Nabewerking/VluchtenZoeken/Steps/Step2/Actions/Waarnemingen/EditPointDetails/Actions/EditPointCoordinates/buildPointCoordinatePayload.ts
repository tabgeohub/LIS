import type { FinishedPointType } from "Types/finished_plans";
import { finalizeCoordinateValues } from "./coordinateFinalize";

export function buildPointCoordinatePayload(
  selectedPoint: FinishedPointType,
  coordinateSystem: string,
  coords: {
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  }
) {
  const finalCoords = finalizeCoordinateValues(coordinateSystem, coords);
  return {
    finalCoords,
    payload: {
      ...selectedPoint,
      ...finalCoords,
      regio_id: selectedPoint.regio_id,
      vertrouwelijk: selectedPoint.vertrouwelijk,
      herhalen: selectedPoint.herhalen,
      user_id: selectedPoint.user_id,
      activiteit_id: selectedPoint.activiteit_id,
      organisatie_id: selectedPoint.organisatie_id,
      specifiek_letten_op: selectedPoint.specifiek_letten_op,
      datum: selectedPoint.datum,
      id: selectedPoint.id,
    },
  };
}
