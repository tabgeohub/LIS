import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

/**
 * Replaces all graphics in a layer with new graphics
 * This is a common pattern: removeAll() followed by addMany()
 * @param layer - The graphics layer to update
 * @param graphics - Array of graphics to add (can be empty)
 */
export function replaceGraphics(
  layer: GraphicsLayer | null | undefined,
  graphics: __esri.Graphic[]
): void {
  if (!layer) return;
  
  layer.removeAll();
  if (graphics.length > 0) {
    layer.addMany(graphics);
  }
}

