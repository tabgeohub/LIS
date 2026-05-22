/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

import { useMapInitialization } from "hooks/useMapInitialization";
import { useRenderPoints } from "hooks/features/useRenderPoints";
import { regionsCoordinates } from "@constants/regionCoordintaes";
import BasemapWidget from "./BasemapWidget";
import { useRenderGeometries } from "hooks/features/useRenderGeometries";

export default function MapComp({
  mapDiv,
}: {
  mapDiv: RefObject<HTMLDivElement>;
}) {
  const { user } = useAuth();
  const {
    map,
    mapView,
    pointsGraphicsLayer,
    graphicsLayerHover,
    selectedPointGraphicsLayer,
    yellowGraphicsLayer,
    geometriesGraphicsLayer,
  } = useMapViewState();

  useMapInitialization(mapDiv);
  useRenderPoints();
  useRenderGeometries();

  useEffect(() => {
    if (user.user_id !== 0) return;
    map?.removeAll();
  }, [user.user_id]);

  useEffect(() => {
    if (user.user_id !== 0) {
      const currentRegion = regionsCoordinates.find(
        (region) => region.role === user.role.split(" ")[1]
      );

      setTimeout(() => {
        if (currentRegion) {
          mapView?.goTo({
            target: currentRegion.center,
            zoom: currentRegion.zoom,
          });
        } else {
          mapView?.goTo({
            target: [4.9041, 52.3676],
            zoom: 8,
          });
        }
      }, 1000);
    }
  }, [user.user_id, user.role, mapView]);

  useEffect(() => {
    if (!mapView) return;
    const includeLayers = [
      pointsGraphicsLayer,
      selectedPointGraphicsLayer,
      yellowGraphicsLayer,
      geometriesGraphicsLayer,
    ].filter(Boolean) as (__esri.Layer | __esri.GraphicsLayer)[];

    const { setHovered } = useHoveredGraphicState.getState();
    const pointHoverSymbol = new SimpleMarkerSymbol({
      style: "circle",
      color: [255, 213, 0, 0.9],
      size: 12,
      outline: {
        color: [255, 255, 255, 1],
        width: 1.5,
      },
    });
    const polygonHoverSymbol = new SimpleFillSymbol({
      color: [0, 0, 0, 0], // Transparent fill
      outline: {
        color: [255, 213, 0, 0.9], // Yellow outline
        width: 3,
      },
    });
    const lineHoverSymbol = new SimpleLineSymbol({
      color: [255, 213, 0, 0.9], // Yellow
      width: 4,
    });

    const clearHover = () => {
      graphicsLayerHover?.removeAll();
      setHovered(null);
    };

    const pointerHandle = mapView.on("pointer-move", async (event) => {
      if (mapView.interacting) {
        clearHover();
        return;
      }

      try {
        const response = await mapView.hitTest(
          event,
          includeLayers.length > 0 ? { include: includeLayers } : undefined
        );

        const match = response.results.find(
          (result): result is __esri.MapViewGraphicHit =>
            result.type === "graphic" &&
            (result.graphic?.geometry?.type === "point" ||
              result.graphic?.geometry?.type === "polygon" ||
              result.graphic?.geometry?.type === "polyline")
        );

        if (match && match.graphic?.geometry) {
          const attrs = match.graphic.attributes || {};
          const geometryType = match.graphic.geometry.type;

          // Determine label based on geometry type
          let label: string;
          if (geometryType === "polygon" || geometryType === "polyline") {
            label =
              attrs.omschrijving ||
              attrs.name ||
              attrs.label ||
              attrs.title ||
              (geometryType === "polygon"
                ? "Onbekend veelhoek"
                : "Onbekend lijn");
          } else {
            label =
              attrs.omschrijving ||
              attrs.name ||
              attrs.label ||
              attrs.title ||
              "Onbekend punt";
          }

          const id =
            attrs.id ??
            attrs.geometryId ??
            attrs.objectid ??
            attrs.objectId ??
            attrs.OBJECTID ??
            Date.now();

          setHovered({ id, label, point: attrs });
          graphicsLayerHover?.removeAll();

          // Choose appropriate hover symbol based on geometry type
          let hoverSymbol:
            | SimpleMarkerSymbol
            | SimpleFillSymbol
            | SimpleLineSymbol;
          if (geometryType === "polygon") {
            hoverSymbol = polygonHoverSymbol;
          } else if (geometryType === "polyline") {
            hoverSymbol = lineHoverSymbol;
          } else {
            hoverSymbol = pointHoverSymbol;
          }

          graphicsLayerHover?.add(
            new Graphic({
              geometry: match.graphic.geometry,
              symbol: hoverSymbol,
            })
          );
        } else {
          clearHover();
        }
      } catch (error) {
        clearHover();
      }
    });

    return () => {
      pointerHandle.remove();
      clearHover();
    };
  }, [
    mapView,
    pointsGraphicsLayer,
    graphicsLayerHover,
    selectedPointGraphicsLayer,
    yellowGraphicsLayer,
    geometriesGraphicsLayer,
  ]);

  return (
    <div className="mapView h-full w-full" ref={mapDiv}>
      <BasemapWidget />
    </div>
  );
}
