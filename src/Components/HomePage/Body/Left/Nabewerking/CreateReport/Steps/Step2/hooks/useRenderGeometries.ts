import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import Graphic from "@arcgis/core/Graphic";
import useLogAction from "hooks/useLogAction";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";

export function useRenderGeometries(
  selectedPlan: FinishedFlightPlanType | null,
  selectedGeometries: number[]
) {
  const { mapView, geometriesGraphicsLayer } = useMapViewState();
  const logAction = useLogAction();

  useEffect(() => {
    if (!mapView || !selectedPlan || !geometriesGraphicsLayer) return;

    geometriesGraphicsLayer.removeAll();

    const graphics: Graphic[] = [];

    // First, render all geometries in blue
    selectedPlan.geometries?.forEach((geometry) => {
      if (!geometry.points || geometry.points.length === 0) return;

      const graphic = createGeometryGraphic(
        {
          id: geometry.id,
          geometry_type: (geometry.geometry_type as "polygon" | "line") || undefined,
          geometry_omschrijving: geometry.geometry_omschrijving || undefined,
          points: geometry.points,
        },
        {
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

    // Then, overlay selected geometries in yellow on top
    if (selectedGeometries.length > 0) {
      selectedPlan.geometries
        ?.filter((geometry) => selectedGeometries.includes(geometry.id))
        .forEach((geometry) => {
          if (!geometry.points || geometry.points.length === 0) return;

          const graphic = createGeometryGraphic(
            {
              id: geometry.id,
              geometry_type: (geometry.geometry_type as "polygon" | "line") || undefined,
              geometry_omschrijving: geometry.geometry_omschrijving || undefined,
              points: geometry.points,
            },
            {
              symbolOptions: {
                fillColor: [0, 0, 0, 0], // Transparent fill
                outlineColor: [255, 255, 0, 1], // Yellow outline
                lineColor: [255, 255, 0, 1], // Yellow line
                outlineWidth: 3,
                lineWidth: 4,
              },
              attributes: {
                ...geometry,
                isSelected: true,
              },
            }
          );

          if (graphic) {
            graphics.push(graphic);
          }
        });
    }

    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }

    logAction({
      message: "User selected geometries",
      step: "First step",
      newData: {
        geometries: selectedGeometries,
      },
    });
  }, [
    selectedGeometries,
    mapView,
    selectedPlan,
    geometriesGraphicsLayer,
    logAction,
  ]);
}



