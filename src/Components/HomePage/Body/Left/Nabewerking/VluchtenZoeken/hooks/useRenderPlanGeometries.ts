/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import Graphic from "@arcgis/core/Graphic";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
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
          return null;
        }

        return [longitude, latitude];
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

