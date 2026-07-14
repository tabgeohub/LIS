import Extent from "@arcgis/core/geometry/Extent";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

const NETHERLANDS_RING = [
  [3.8460910856539243, 53.81426843834605],
  [7.852439640112755, 53.684339986202524],
  [6.746481710653153, 50.62111706044792],
  [2.8280251264390306, 50.96833816802285],
  [3.8460910856539243, 53.81426843834605],
];

export function createNetherlandsMapBounds() {
  const polygon = new Polygon({
    spatialReference: { wkid: 4326 },
    rings: [NETHERLANDS_RING],
  });
  const extent = new Extent({
    xmin: 2.8280251264390306,
    ymin: 50.62111706044792,
    xmax: 7.852439640112755,
    ymax: 53.81426843834605,
    spatialReference: { wkid: 4326 },
  });

  return {
    polygon: webMercatorUtils.geographicToWebMercator(polygon) as Polygon,
    extent: webMercatorUtils.geographicToWebMercator(extent) as Extent,
  };
}
