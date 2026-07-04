import {
  createMapHoverGraphic,
  isMapHoverGraphicHit,
  resolveMapHoverId,
  resolveMapHoverLabel,
} from "./mapHoverHighlight";

export function createMapPointerHoverHandler(input: {
  mapView: __esri.MapView;
  includeLayers: (__esri.Layer | __esri.GraphicsLayer)[];
  graphicsLayerHover: __esri.GraphicsLayer | null;
  setHovered: (value: {
    id: number;
    label: string;
    point?: unknown;
  } | null) => void;
}) {
  const clearHover = () => {
    input.graphicsLayerHover?.removeAll();
    input.setHovered(null);
  };

  return async (event: __esri.ViewPointerMoveEvent) => {
    if (input.mapView.interacting) {
      clearHover();
      return;
    }

    try {
      const response = await input.mapView.hitTest(
        event,
        input.includeLayers.length > 0 ? { include: input.includeLayers } : undefined
      );

      const match = response.results.find(isMapHoverGraphicHit);
      if (!match?.graphic?.geometry) {
        clearHover();
        return;
      }

      const attrs = match.graphic.attributes || {};
      const geometryType = match.graphic.geometry.type;
      input.setHovered({
        id: Number(resolveMapHoverId(attrs)),
        label: resolveMapHoverLabel({ geometryType, attributes: attrs }),
        point: attrs,
      });

      input.graphicsLayerHover?.removeAll();
      input.graphicsLayerHover?.add(createMapHoverGraphic(match.graphic.geometry));
    } catch {
      clearHover();
    }
  };
}
