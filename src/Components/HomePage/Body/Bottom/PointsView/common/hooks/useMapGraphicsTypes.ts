import { RefObject } from "react";
import Graphic from "@arcgis/core/Graphic";
import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";

/** Shared table/star data for map graphics sync (hook input + syncTableTabGraphics). */
export type TableTabGraphicsData = {
  tab: string;
  pointsTable: EnrichedPointType[];
  geometriesTable: Geometry[];
  flightPlans: FlightPlanType[];
  starredPoints: EnrichedPointType[];
  starredGeometries: Geometry[];
  starredPlans: FlightPlanType[];
};

export type UseMapGraphicsInput = TableTabGraphicsData & {
  graphicsLayer: __esri.GraphicsLayer | null;
  graphicsLayerHover: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  mapView: __esri.MapView | null;
  originalGraphicsMap: RefObject<Map<number, Graphic>>;
};
