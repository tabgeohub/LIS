export interface FinishedFlightPlanType {
  id: number;
  status: string;
  aanvullende: string;
  basemap: string;
  created_at: string;
  datum: string;
  path: {
    speed: number;
    altitude: number;
    latitude: number;
    longitude: number;
    rotationAngle: number;
  }[];
  hoofdthema: string;
  luchtvaartuig: string;
  omschrijving: string;
  passagiers: number;
  piloot: string;
  points_data: FinishedPointType[];
  user_id: number;
  vliegduur: string;
  vluchtnummer: string;
  waarnemer: string;
  attachments: AttachmentType[];
}

export interface FinishedPointType {
  id: number;
  omschrijving: string;
  regio_id: string;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
  vertrouwelijk: string;
  herhalen: string;
  user_id: number;
  activiteit_id: string;
  organisatie_id: string;
  specifiek_letten_op: string;
  datum: string;
  order: number;
  point_comment: string;
  attachments: AttachmentType[];
}

interface AttachmentType {
  id: number;
  url: string;
  point_id?: number;
  attachmentid?: number;
  taken_at: number;
}
