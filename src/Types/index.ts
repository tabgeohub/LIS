import type { Geometry } from "./geometry";

export interface EnrichedPointType {
  id: number;
  omschrijving: string;
  regio_id: string;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  latitude: number;
  longitude: number;
  herhalen: number;
  vertrouwelijk: number;
  user_id: number;
  activiteit_id: string;
  organisatie_id: string;
  specifiek_letten_op: string;
  status?: string;
  created_at?: string;
  datum: string;
  Point_description: string;
  aanmaker: string;
  order?: number;
  region: string;
  copiedFrom?: number;
  geometry_id?: number;
  geometry_omschrijving?: string;
}

export interface FlightPlanType {
  vluchtnummer: string;
  omschrijving: string;
  waarnemer: string;
  piloot: string;
  datum: string;
  vliegduur: string;
  luchtvaartuig: string;
  passagiers: number;
  hoofdthema: string;
  aanvullende: string;
  points: EnrichedPointType[];
  geometries?: Geometry[]; // Optional geometries array
  id: number;
  basemap: string;
  layers: string;
  user_id: number;
  prepared: number;
  status: FlightPlanStatus;
  geplandeVliegduur: string;
  typeLuchtvaartuig: string;
  pointsObjects: EnrichedPointType[];
  regio_id: string;
  spoed?: number;
  startTime?: string;
  endTime?: string;
  flightDuration?: number;
  distance?: number;
  activiteit_id?: string;
  organisatie_id?: string;
  created_at?: string;
  is_finished?: boolean;
}

export interface UserType {
  role: string;
  user_id: number;
  user_name: string;
  email?: string;
}

export interface LayerType {
  id: string;
  layer: string;
  checked: boolean;
  icon?: any;
  sublayers?: SubLayerType[];
}

interface SubLayerType {
  id: string;
  layer: string;
  checked: boolean;
  icon?: any;
  subSublayers?: SubSubLayerType[];
}

interface SubSubLayerType {
  id: string;
  layer: string;
  icon?: any;
  checked: boolean;
}

export interface PDFPointDataType {
  datum: string;
  piloot: string;
  waarnemer: string;
  luchtvaartuig: string;
  hoofdthema: string;
  organisatie: string;
  activiteit: string;
  regio: string;
  omschrijving: string;
  aanvullende: number;
  rdX: number;
  rdY: number;
  long: number;
  lat: number;
  tijd?: string;
}

export interface EmailType {
  id: string;
  email: string;
}

export type VoorbereidingTabsType =
  | "none"
  | "enrichedAddPoint"
  | "templateFlights"
  | "addPoint"
  | "flightPlan"
  | "viewPlan"
  | "prepareFlightPlan"
  | "removeFlightPlan"
  | "reuseFlightPlan"
  | "tekengereedschap";

export type ToolsTabsType =
  | "none"
  | "emailijst"
  | "verwijderen"
  | "startgebied"
  | "bevragen"
  | "kaartlagen"
  | "uploaden"
  | "exporteer"
  | "editGeometry";

export type NabewerkingTabsType =
  | "none"
  | "vluchtZoeken"
  | "waarnemings"
  | "vluchtplanStatus";

export type TabType =
  | VoorbereidingTabsType
  | ToolsTabsType
  | NabewerkingTabsType
  | "timeslider"
  | "aandachtspuntenFilteren";

export type PageType = "voorbereiding" | "nabewerking" | "tools" | "timeslider";

export type SpatialReference = "WGS84" | "RD";

export type BasemapsType = "topo-vector" | "luchtfoto" | "open-topo";

type FlightPlanStatus =
  | "pre-prepared"
  | "prepared"
  | "in-progress"
  | "finished"
  | "deleted"
  | "canceled";
