import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

export default function createPoint(x_coord: number, y_coord: number) {
  const point = new Point({
    longitude: x_coord,
    latitude: y_coord,
  });

  const markerSymbol = new SimpleMarkerSymbol({
    color: "red",
    outline: { color: "white", width: 2 },
    size: "20px",
  });

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: markerSymbol,
  });

  return pointGraphic;
}
