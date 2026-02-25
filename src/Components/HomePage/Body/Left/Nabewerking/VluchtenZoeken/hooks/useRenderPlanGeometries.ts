/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import Graphic from "@arcgis/core/Graphic";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { createGeometryGraphic, GeometryPoint } from "@helpers/ArcGISHelpers/createGeometryGraphic";

/**
 * Hook to render plan geometries on the map
 * Always renders plan geometries when in Step2, regardless of action
 */
export function useRenderPlanGeometries() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, geometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !geometriesGraphicsLayer || !selectedPlan?.geometries) return;

    geometriesGraphicsLayer.removeAll();

    const graphics: __esri.Graphic[] = [];

    selectedPlan.geometries.forEach((geometry) => {
      if (!geometry.points || geometry.points.length === 0) return;

      // Transform coordinates function for RD to WGS84 conversion
      const transformCoordinates = (point: GeometryPoint): [number, number] | null => {
        const coords = getPointCoordinates(point);
        if (!coords) return null;
        return [coords.longitude, coords.latitude];
      };

      const graphic = createGeometryGraphic(
        {
          id: geometry.id,
          geometry_type: geometry.geometry_type,
          geometry_omschrijving: geometry.geometry_omschrijving,
          points: geometry.points,
        },
        {
          transformCoordinates,
          attributes: {
            geometryId: geometry.id,
            geometryType: geometry.geometry_type,
            omschrijving: geometry.geometry_omschrijving,
            type: "geometry",
          },
        }
      );

      if (graphic) {
        graphics.push(graphic);
      }
    });

    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }
  }, [selectedPlan?.geometries, mapView, geometriesGraphicsLayer]);
}

