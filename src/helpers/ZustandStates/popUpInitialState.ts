import { EnrichedPointType } from "Types";

export const initialPointState: EnrichedPointType = {
  id: 0,
  omschrijving: "",
  regio_id: "",
  xcoordinaat_rd: 0,
  ycoordinaat_rd: 0,
  latitude: 0,
  longitude: 0,
  herhalen: 0,
  vertrouwelijk: 0,
  user_id: 0,
  activiteit_id: "",
  organisatie_id: "",
  specifiek_letten_op: "",
  datum: "",
  Point_description: "",
  aanmaker: "",
  region: "",
};

export type FeatureLayerAttributes = {
  [key: string]: any;
};
