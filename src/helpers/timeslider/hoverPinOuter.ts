import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { TIMESLIDER_RIGHT_HOVER_LABEL } from "./timesliderRightHoverLabel";
import type { HoverPinAttrs } from "./hoverPinAttrsType";

export function hoverPinPoint(longitude: number, latitude: number) {
  return new Point({
    longitude,
    latitude,
    spatialReference: { wkid: 4326 },
  });
}

export function hoverPinAttrs(id?: number): HoverPinAttrs {
  return { label: TIMESLIDER_RIGHT_HOVER_LABEL, id, kind: "hover-pin" };
}

export function createHoverOuterGraphic(
  geometry: Point,
  attributes: HoverPinAttrs
) {
  return new Graphic({
    geometry,
    symbol: new SimpleMarkerSymbol({
      style: "circle",
      color: [255, 255, 0, 0],
      size: 16,
      outline: { color: "#4ff1ff", width: 3 },
    }),
    attributes,
  });
}
