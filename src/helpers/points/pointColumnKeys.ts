export const POINT_CORE_DISPLAY_COLUMNS = [
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "herhalen",
  "vertrouwelijk",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;

export const POINT_EXPORT_COLUMNS = [
  "geometry",
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "herhalen",
  "vertrouwelijk",
  "indiener_id",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
] as const;

export type PointImportRow = {
  omschrijving: string;
  regio_id: string;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
  herhalen: number | string | boolean;
  vertrouwelijk: number | string | boolean;
  user_id: string;
  activiteit_id: string;
  organisatie_id: string;
  specifiek_letten_op: string;
};
