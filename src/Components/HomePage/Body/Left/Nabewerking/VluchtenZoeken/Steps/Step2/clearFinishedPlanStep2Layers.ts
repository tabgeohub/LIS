/** Shared layer cleanup for VluchtenZoeken Step2 previous / cancel. */
export function clearFinishedPlanStep2Layers(input: {
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  input.graphicsLayer?.removeAll();
  input.graphicsLayerHover?.removeAll();
  input.redGraphicsLayer?.removeAll();
  input.geometriesGraphicsLayer?.removeAll();
}
