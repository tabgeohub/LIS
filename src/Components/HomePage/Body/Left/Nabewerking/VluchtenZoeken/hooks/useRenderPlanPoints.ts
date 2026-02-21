/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

/**
 * Hook to render plan points on the map
 * Always renders plan points when in Step2, regardless of action
 */
export function useRenderPlanPoints() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, pointsGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !pointsGraphicsLayer || !selectedPlan?.points_data) return;

    pointsGraphicsLayer.removeAll();

    const blueSymbol = new SimpleMarkerSymbol({
      color: "blue",
      size: 12,
      style: "circle",
      outline: {
        color: "white",
        width: 1,
      },
    });

    const graphics: __esri.Graphic[] = [];

    selectedPlan.points_data.forEach((point) => {
      if (!point) return;

      // Get coordinates - prefer WGS84, fallback to RD transformation
      let longitude: number | undefined = point.longitude;
      let latitude: number | undefined = point.latitude;

      if (
        (typeof longitude !== "number" || typeof latitude !== "number") &&
        typeof point.xcoordinaat_rd === "number" &&
        typeof point.ycoordinaat_rd === "number"
      ) {
        const wgs = getTransformedCoordinates(
          "RD",
          "WGS84",
          point.xcoordinaat_rd,
          point.ycoordinaat_rd
        );
        longitude = wgs.x;
        latitude = wgs.y;
      }

      if (typeof longitude !== "number" || typeof latitude !== "number") {
        return;
      }

      const geometry = new Point({
        longitude,
        latitude,
        spatialReference: { wkid: 4326 },
      });

      const graphic = new Graphic({
        geometry,
        symbol: blueSymbol,
        attributes: point,
      });

      graphics.push(graphic);
    });

    if (graphics.length > 0) {
      pointsGraphicsLayer.addMany(graphics);
    }
  }, [selectedPlan?.points_data, mapView, pointsGraphicsLayer]);
}

