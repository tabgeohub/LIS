import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { buildPointMarkerSymbol } from "@helpers/ArcGISHelpers/pointMarkerSymbol";

/** Yellow WGS84 point graphic used by ViewPlan yellow preview layers. */
export function createYellowWgs84PointGraphic(input: {
  longitude: number;
  latitude: number;
  attributes: object;
}): Graphic {
  return new Graphic({
    geometry: new Point({
      longitude: input.longitude,
      latitude: input.latitude,
      spatialReference: { wkid: 4326 },
    }),
    symbol: buildPointMarkerSymbol({ color: "yellow" }),
    attributes: input.attributes,
  });
}
