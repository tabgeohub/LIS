/** Shared point field shapes used across Types and point helpers. */

export type PointCoreIdentityFields = {
  omschrijving: string;
  regio_id: string;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
};

export type PointCoreOrgFields = {
  user_id: number;
  activiteit_id: string;
  organisatie_id: string;
  specifiek_letten_op: string;
};

export type PointCorePayloadFields = PointCoreIdentityFields &
  PointCoreOrgFields & {
    vertrouwelijk: boolean | number | string;
    herhalen: boolean | number | string;
  };
