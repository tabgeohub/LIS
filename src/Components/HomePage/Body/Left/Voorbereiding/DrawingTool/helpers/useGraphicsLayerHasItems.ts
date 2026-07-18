import { useEffect, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export function useGraphicsLayerHasItems(graphicsLayer: GraphicsLayer | null) {
  const [hasGraphics, setHasGraphics] = useState(false);
  useEffect(() => {
    if (!graphicsLayer) {
      setHasGraphics(false);
      return;
    }
    const updateGraphicsCount = () => {
      setHasGraphics(graphicsLayer.graphics.length > 0);
    };
    updateGraphicsCount();
    const handle = graphicsLayer.graphics.on("change", updateGraphicsCount);
    return () => {
      handle.remove();
    };
  }, [graphicsLayer]);
  return hasGraphics;
}
