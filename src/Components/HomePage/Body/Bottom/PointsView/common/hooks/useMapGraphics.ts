import { useEffect, RefObject } from "react";
import Graphic from "@arcgis/core/Graphic";
import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import { syncTableTabGraphics } from "./syncTableTabGraphics";

export type UseMapGraphicsInput = {
  tab: string;
  pointsTable: EnrichedPointType[];
  geometriesTable: Geometry[];
  flightPlans: FlightPlanType[];
  starredPoints: EnrichedPointType[];
  starredGeometries: Geometry[];
  starredPlans: FlightPlanType[];
  graphicsLayer: __esri.GraphicsLayer | null;
  graphicsLayerHover: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  mapView: __esri.MapView | null;
  originalGraphicsMap: RefObject<Map<number, Graphic>>;
};

export const useMapGraphics = (input: UseMapGraphicsInput) => {
  useEffect(() => {
    syncTableTabGraphics({
      tab: input.tab,
      ctx: {
        graphicsLayer: input.graphicsLayer,
        yellowGraphicsLayer: input.yellowGraphicsLayer,
        mapView: input.mapView,
        originalGraphicsMap: input.originalGraphicsMap,
      },
      pointsTable: input.pointsTable,
      geometriesTable: input.geometriesTable,
      flightPlans: input.flightPlans,
      starredPoints: input.starredPoints,
      starredGeometries: input.starredGeometries,
      starredPlans: input.starredPlans,
    });
  }, [
    input.tab,
    input.pointsTable,
    input.geometriesTable,
    input.flightPlans,
    input.starredPoints,
    input.starredGeometries,
    input.starredPlans,
    input.graphicsLayer,
    input.graphicsLayerHover,
    input.yellowGraphicsLayer,
    input.mapView,
    input.originalGraphicsMap,
  ]);
};
