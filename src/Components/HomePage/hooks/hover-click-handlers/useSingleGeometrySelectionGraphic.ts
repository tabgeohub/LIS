import { useEffect } from "react";
import {
  ClickableGeometry,
  createSelectionGeometryGraphic,
} from "Components/HomePage/helpers/ArcGISHelpers/createGeometryMapGraphics";

export function useSingleGeometrySelectionGraphic(input: {
  enabled: boolean;
  selectedGeometry: ClickableGeometry | null;
  layer: __esri.GraphicsLayer | null;
}) {
  useEffect(() => {
    if (!input.enabled || !input.layer) return;
    input.layer.graphics.removeAll();
    if (!input.selectedGeometry?.points?.length) return;
    const graphic = createSelectionGeometryGraphic(input.selectedGeometry, input.selectedGeometry);
    if (graphic) input.layer.add(graphic);
    return () => {
      input.layer?.graphics.removeAll();
    };
  }, [input.enabled, input.selectedGeometry, input.layer]);
}
