import {
  createHoverOuterGraphic,
  createHoverPinGraphic,
  hoverPinAttrs,
  hoverPinPoint,
} from "./hoverPinGraphics";

export function createHoverPinGraphics(input: {
  longitude: number;
  latitude: number;
  id?: number;
}) {
  const geometry = hoverPinPoint(input.longitude, input.latitude);
  const attributes = hoverPinAttrs(input.id);
  return [
    createHoverOuterGraphic(geometry, attributes),
    createHoverPinGraphic(geometry, attributes),
  ];
}
