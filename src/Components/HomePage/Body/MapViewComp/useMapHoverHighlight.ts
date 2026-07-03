/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import {
  createMapHoverGraphic,
  isMapHoverGraphicHit,
  resolveMapHoverId,
  resolveMapHoverLabel,
} from "./mapHoverHighlight";

export function useMapHoverHighlight() {
  const {
    mapView,
    pointsGraphicsLayer,
    graphicsLayerHover,
    selectedPointGraphicsLayer,
    yellowGraphicsLayer,
    geometriesGraphicsLayer,
  } = useMapViewState();

  useEffect(() => {
    if (!mapView) return;

    const includeLayers = [
      pointsGraphicsLayer,
      selectedPointGraphicsLayer,
      yellowGraphicsLayer,
      geometriesGraphicsLayer,
    ].filter(Boolean) as (__esri.Layer | __esri.GraphicsLayer)[];

    const { setHovered } = useHoveredGraphicState.getState();

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

        const match = response.results.find(isMapHoverGraphicHit);
        if (!match?.graphic?.geometry) {
          clearHover();
          return;
        }

        const attrs = match.graphic.attributes || {};
        const geometryType = match.graphic.geometry.type;
        setHovered({
          id: Number(resolveMapHoverId(attrs)),
          label: resolveMapHoverLabel({ geometryType, attributes: attrs }),
          point: attrs,
        });

        graphicsLayerHover?.removeAll();
        graphicsLayerHover?.add(
          createMapHoverGraphic(match.graphic.geometry)
        );
      } catch {
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
}
