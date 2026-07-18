import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import type { HoverPinAttrs } from "./hoverPinAttrsType";

export function createHoverPinGraphic(
  geometry: Point,
  attributes: HoverPinAttrs
) {
  return new Graphic({
    geometry,
    symbol: new PictureMarkerSymbol({
      url: "/pin.png",
      width: "24px",
      height: "24px",
      yoffset: 9,
    }),
    attributes,
  });
}
