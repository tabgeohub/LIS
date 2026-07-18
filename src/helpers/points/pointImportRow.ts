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
