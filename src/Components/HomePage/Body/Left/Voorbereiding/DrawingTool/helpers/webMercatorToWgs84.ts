import Point from "@arcgis/core/geometry/Point";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

export function webMercatorToWgs84(
  x: number,
  y: number
): { longitude: number; latitude: number } | null {
  const webMercatorPoint = new Point({
    x,
    y,
    spatialReference: { wkid: 3857 },
  });
  const wgs84Point = webMercatorUtils.webMercatorToGeographic(
    webMercatorPoint
  ) as Point;
  const { longitude, latitude } = wgs84Point;
  if (
    typeof longitude !== "number" ||
    typeof latitude !== "number" ||
    !isFinite(longitude) ||
    !isFinite(latitude)
  ) {
    return null;
  }
  return { longitude, latitude };
}
