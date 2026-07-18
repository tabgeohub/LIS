import type { FinishedPointType } from "Types/finished_plans";

export type EditPointDetailsPayload = {
  omschrijving: string;
  regio_id: FinishedPointType["regio_id"];
  xcoordinaat_rd: FinishedPointType["xcoordinaat_rd"];
  ycoordinaat_rd: FinishedPointType["ycoordinaat_rd"];
  latitude: FinishedPointType["latitude"];
  longitude: FinishedPointType["longitude"];
  vertrouwelijk: FinishedPointType["vertrouwelijk"];
  herhalen: FinishedPointType["herhalen"];
  user_id: FinishedPointType["user_id"];
  activiteit_id: FinishedPointType["activiteit_id"];
  organisatie_id: FinishedPointType["organisatie_id"];
  specifiek_letten_op: string;
  datum: FinishedPointType["datum"];
  id: FinishedPointType["id"];
};
