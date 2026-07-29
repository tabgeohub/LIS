import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

export function createPinPointGeometry(longitude: number, latitude: number) {
  return new Point({
    longitude,
    latitude,
    spatialReference: { wkid: 4326 },
  });
}

export function createPinOuterSymbol() {
  return new SimpleMarkerSymbol({
    style: "circle",
    color: [255, 255, 0, 0],
    size: 16,
    outline: {
      color: "#4ff1ff",
      width: 3,
    },
  });
}

export function createPinPictureSymbol() {
  return new PictureMarkerSymbol({
    url: "/pin.png",
    width: "24px",
    height: "24px",
    yoffset: 9,
  });
}

export function buildPinGraphics(input: {
  longitude: number;
  latitude: number;
  pointId: number;
  label?: string;
}) {
  const geometry = createPinPointGeometry(input.longitude, input.latitude);
  const label = input.label || "";

  const outerGraphic = new Graphic({
    geometry,
    symbol: createPinOuterSymbol(),
    attributes: { label },
  });

  const pinGraphic = new Graphic({
    geometry: createPinPointGeometry(input.longitude, input.latitude),
    symbol: createPinPictureSymbol(),
    attributes: { id: input.pointId, label },
  });

  return { outerGraphic, pinGraphic };
}
