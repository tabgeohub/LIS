import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { GeometryPointPayload } from "./buildGeometryPointsFromDrawn";
import { webMercatorToWgs84 } from "./webMercatorToWgs84";

export type GeometryPointContext = {
  omschrijving: string;
  userRole: string | undefined;
  userId: number | undefined;
  herhalen: boolean;
  organisatie: string;
  vertrouwelijk: boolean;
  activiteit: string;
  specifiekLettenOp: string;
};

export function buildGeometryPointFields(
  wgs84: { longitude: number; latitude: number },
  pointOrder: number,
  geometryType: string,
  ctx: GeometryPointContext
): GeometryPointPayload {
  const rdCoords = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: wgs84.longitude,
    y: wgs84.latitude,
  });
  return {
    omschrijving: `${ctx.omschrijving}_point_${pointOrder}`,
    regio_id: ctx.userRole,
    xcoordinaat_rd: rdCoords.x,
    ycoordinaat_rd: rdCoords.y,
    longitude: wgs84.longitude,
    latitude: wgs84.latitude,
    user_id: ctx.userId,
    herhalen: ctx.herhalen ? 1 : 0,
    organisatie: ctx.organisatie,
    omschrijving_original: ctx.omschrijving,
    vertrouwelijk: ctx.vertrouwelijk ? 1 : 0,
    activiteit: ctx.activiteit,
    specifiekLettenOp: ctx.specifiekLettenOp,
    geometry_type: geometryType,
  };
}

export function toGeometryPointPayload(
  x: number,
  y: number,
  pointOrder: number,
  geometryType: string,
  ctx: GeometryPointContext
): GeometryPointPayload | null {
  const wgs84 = webMercatorToWgs84(x, y);
  if (!wgs84) return null;
  return buildGeometryPointFields(wgs84, pointOrder, geometryType, ctx);
}
