import Point from "@arcgis/core/geometry/Point";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

export type DrawnShape = {
  type: string;
  points: number[][];
};

export type GeometryPointPayload = {
  omschrijving: string;
  regio_id: string | undefined;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  longitude: number;
  latitude: number;
  user_id: number | undefined;
  herhalen: number;
  organisatie: string;
  omschrijving_original: string;
  vertrouwelijk: number;
  activiteit: string;
  specifiekLettenOp: string;
  geometry_type: string;
};

function webMercatorToWgs84(x: number, y: number): { longitude: number; latitude: number } | null {
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

export function buildGeometryPointsFromDrawn(input: {
  graphicsDrawn: DrawnShape[];
  omschrijving: string;
  userRole: string | undefined;
  userId: number | undefined;
  herhalen: boolean;
  organisatie: string;
  vertrouwelijk: boolean;
  activiteit: string;
  specifiekLettenOp: string;
}): GeometryPointPayload[] {
  const {
    graphicsDrawn,
    omschrijving,
    userRole,
    userId,
    herhalen,
    organisatie,
    vertrouwelijk,
    activiteit,
    specifiekLettenOp,
  } = input;

  const points: GeometryPointPayload[] = [];
  let pointOrder = 1;

  graphicsDrawn.forEach((shape) => {
    shape.points.forEach(([x, y]) => {
      const wgs84 = webMercatorToWgs84(x, y);
      if (!wgs84) return;

      const rdCoords = getTransformedCoordinates({
        fromProjection: "WGS84",
        toProjection: "RD",
        x: wgs84.longitude,
        y: wgs84.latitude,
      });

      points.push({
        omschrijving: `${omschrijving}_point_${pointOrder}`,
        regio_id: userRole,
        xcoordinaat_rd: rdCoords.x,
        ycoordinaat_rd: rdCoords.y,
        longitude: wgs84.longitude,
        latitude: wgs84.latitude,
        user_id: userId,
        herhalen: herhalen ? 1 : 0,
        organisatie,
        omschrijving_original: omschrijving,
        vertrouwelijk: vertrouwelijk ? 1 : 0,
        activiteit,
        specifiekLettenOp,
        geometry_type: shape.type,
      });
      pointOrder++;
    });
  });

  return points;
}

export function resolveCombinedGeometryType(types: string[]): string {
  const unique = Array.from(new Set(types));
  if (unique.length === 1) return unique[0];
  return unique.join(", ");
}
