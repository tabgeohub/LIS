import { EnrichedPointType } from "Types";
import type { DeletePointFormSetters } from "./deletePointFormSetters";

export function syncSelectedPointToDeleteState(
  selectedPoint: EnrichedPointType,
  setters: DeletePointFormSetters
) {
  setters.setOmschrijving(selectedPoint.omschrijving);
  setters.setRegio_id(selectedPoint.regio_id);
  setters.setXCoordinaat_rd(selectedPoint.xcoordinaat_rd);
  setters.setYCoordinaat_rd(selectedPoint.ycoordinaat_rd);
  setters.setLatitude(selectedPoint.latitude);
  setters.setLongitude(selectedPoint.longitude);
  setters.setHerhalen(selectedPoint.herhalen === 1);
  setters.setVertrouwelijk(selectedPoint.vertrouwelijk);
  setters.setUser_id(selectedPoint.user_id);
  setters.setActiviteit_id(selectedPoint.activiteit_id);
  setters.setOrganisatie_id(selectedPoint.organisatie_id);
  setters.setSpecifiek_letten_op(selectedPoint.specifiek_letten_op);
}
