import { EnrichedPointType } from "Types";

export type AandachtspuntenVerwijderenType =
  | "main"
  | "pointDetails"
  | "editSelectedPoint"
  | "deletePoint"
  | "viewPlans"
  | "addToPlan"
  | "filter";

export interface DeletePoint {
  mainStep: AandachtspuntenVerwijderenType;
  setMainStep: (value: AandachtspuntenVerwijderenType) => void;

  selectedPoints: EnrichedPointType[];
  setSelectedPoints: (value: EnrichedPointType[]) => void;

  selectedPoint: EnrichedPointType | null;
  setSelectedPoint: (value: EnrichedPointType | null) => void;

  omschrijving: string;
  setOmschrijving: (value: string) => void;

  regio_id: string;
  setRegio_id: (value: string) => void;

  xcoordinaat_rd: number;
  setXCoordinaat_rd: (value: number) => void;

  ycoordinaat_rd: number;
  setYCoordinaat_rd: (value: number) => void;

  latitude: number;
  setLatitude: (value: number) => void;

  longitude: number;
  setLongitude: (value: number) => void;

  herhalen: boolean;
  setHerhalen: (value: boolean) => void;

  vertrouwelijk: number;
  setVertrouwelijk: (value: number) => void;

  user_id: number;
  setUser_id: (value: number) => void;

  activiteit_id: string;
  setActiviteit_id: (value: string) => void;

  organisatie_id: string;
  setOrganisatie_id: (value: string) => void;

  specifiek_letten_op: string;
  setSpecifiek_letten_op: (value: string) => void;

  clear: () => void;
}
