/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

import { useMapInitialization } from "hooks/useMapInitialization";
import { useRenderPoints } from "hooks/useRenderPoints";
import { regionsCoordinates } from "@constants/regionCoordintaes";
import BasemapWidget from "./BasemapWidget";

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
  } = useMapViewState();

  useMapInitialization(mapDiv);
  useRenderPoints();

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
  }, [user]);

  useEffect(() => {
    if (!mapView) return;
    const includeLayers = [
      pointsGraphicsLayer,
      selectedPointGraphicsLayer,
      yellowGraphicsLayer,
    ].filter(Boolean) as (__esri.Layer | __esri.GraphicsLayer)[];

    const { setHovered } = useHoveredGraphicState.getState();
    const hoverSymbol = new SimpleMarkerSymbol({
      style: "circle",
      color: [255, 213, 0, 0.9],
      size: 12,
      outline: {
        color: [255, 255, 255, 1],
        width: 1.5,
      },
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
            result.graphic?.geometry?.type === "point"
        );

        if (match && match.graphic?.geometry) {
          const attrs = match.graphic.attributes || {};
          const label =
            attrs.omschrijving ||
            attrs.name ||
            attrs.label ||
            attrs.title ||
            "Onbekend punt";
          const id =
            attrs.id ??
            attrs.objectid ??
            attrs.objectId ??
            attrs.OBJECTID ??
            Date.now();

          setHovered({ id, label, point: attrs });
          graphicsLayerHover?.removeAll();
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
  ]);

  return (
    <div className="mapView h-full w-full" ref={mapDiv}>
      <BasemapWidget />

      {/* <LayersWidget /> */}
    </div>
  );
}
