import { EnrichedPointType } from "Types";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { FinishedPointType } from "Types/finished_plans";

export function createPin(
  point: EnrichedPointType | FinishedPointType,
  mapView: __esri.MapView,
  label?: string
) {
  const { longitude, latitude } = point;

  const geometry = new Point({
    longitude: longitude,
    latitude: latitude,
    spatialReference: { wkid: 4326 },
  });

  const outerSymbol = new SimpleMarkerSymbol({
    style: "circle",
    color: [255, 255, 0, 0],
    size: 16,
    outline: {
      color: "#4ff1ff",
      width: 3,
    },
  });

  const outerGraphic = new Graphic({
    geometry,
    symbol: outerSymbol,
    attributes: {
      label: label || "",
    },
  });

  const pinSymbol = new PictureMarkerSymbol({
    url: "/pin.png",
    width: "24px",
    height: "24px",
    yoffset: 9,
  });

  const pinGraphic = new Graphic({
    geometry: new Point({
      longitude: longitude,
      latitude: latitude,
      spatialReference: { wkid: 4326 },
    }),

    symbol: pinSymbol,
    attributes: {
      id: point.id,
      label: label || "",
    },
  });

  mapView.graphics.addMany([outerGraphic, pinGraphic]);
  return { outerGraphic, pinGraphic };
}
