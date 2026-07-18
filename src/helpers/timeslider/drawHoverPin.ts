import { createHoverPinGraphics } from "./createHoverPinGraphics";

export function drawHoverPin(input: {
  layer: __esri.GraphicsLayer;
  longitude: number;
  latitude: number;
  id?: number;
}) {
  input.layer.addMany(
    createHoverPinGraphics({
      longitude: input.longitude,
      latitude: input.latitude,
      id: input.id,
    })
  );
}
