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
  geometries: FinishedGeometryType[];
  user_id: number;
  vliegduur: string;
  vluchtnummer: string;
  waarnemer: string;
  attachments: AttachmentType[];
}

import type {
  PointCoreIdentityFields,
  PointCoreOrgFields,
} from "./pointCoreFields";

export interface FinishedPointType
  extends PointCoreIdentityFields,
    PointCoreOrgFields {
  id: number;
  vertrouwelijk: string;
  herhalen: string;
  datum: string;
  order: number;
  point_comment: string;
  attachments: AttachmentType[];
  spoed?: boolean;
  spoedemail?: string;
}

export interface FinishedGeometryType {
  id: number;
  geometry_type: string | null;
  geometry_omschrijving: string | null;
  points: FinishedPointType[];
}

export interface AttachmentType {
  id: number;
  url: string;
  point_id?: number;
  attachmentid?: number;
  taken_at: number;
  location?: string | null;
}
