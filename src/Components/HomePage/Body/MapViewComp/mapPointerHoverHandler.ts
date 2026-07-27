import {
  createMapHoverGraphic,
  isMapHoverGraphicHit,
  resolveMapHoverId,
  resolveMapHoverLabel,
} from "./mapHoverHighlight";

type MapPointerHoverHandlerInput = {
  mapView: __esri.MapView;
  includeLayers: (__esri.Layer | __esri.GraphicsLayer)[];
  graphicsLayerHover: __esri.GraphicsLayer | null;
  setHovered: (value: {
    id: number;
    label: string;
    point?: unknown;
  } | null) => void;
};

function resolveMapHoverHitTestOptions(
  includeLayers: (__esri.Layer | __esri.GraphicsLayer)[]
): __esri.MapViewHitTestOptions | undefined {
  if (includeLayers.length === 0) return undefined;
  return { include: includeLayers };
}

function applyMapHoverFromGraphic(
  input: MapPointerHoverHandlerInput,
  graphic: __esri.Graphic
): void {
  const attrs = graphic.attributes || {};
  const geometryType = graphic.geometry!.type;
  input.setHovered({
    id: Number(resolveMapHoverId(attrs)),
    label: resolveMapHoverLabel({ geometryType, attributes: attrs }),
    point: attrs,
  });
  input.graphicsLayerHover?.removeAll();
  input.graphicsLayerHover?.add(createMapHoverGraphic(graphic.geometry!));
}

export function createMapPointerHoverHandler(input: MapPointerHoverHandlerInput) {
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
        resolveMapHoverHitTestOptions(input.includeLayers)
      );
      const match = response.results.find(isMapHoverGraphicHit);
      if (!match?.graphic?.geometry) {
        clearHover();
        return;
      }
      applyMapHoverFromGraphic(input, match.graphic);
    } catch {
      clearHover();
    }
  };
}
