import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import {
  createGeometryGraphic,
  GeometrySymbolOptions,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

export const yellowGeometrySymbol: GeometrySymbolOptions = {
  fillColor: [255, 255, 0, 0.3],
  outlineColor: [255, 255, 0, 1],
  lineColor: [255, 255, 0, 1],
  outlineWidth: 2,
  lineWidth: 3,
};

export function syncYellowGeometryTableGraphics(input: {
  mapView: __esri.MapView | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  geometriesTable: Array<{
    id: number;
    type?: string;
    omschrijving?: string;
    points?: Array<{ longitude: number; latitude: number }>;
  }> | null | undefined;
}) {
  const layer = input.yellowGraphicsLayer;
  if (!validateMapView(input.mapView, layer) || !layer || !input.geometriesTable?.length) {
    return;
  }

  layer.graphics
    .toArray()
    .filter((graphic) => graphic.attributes?.type === "geometry")
    .forEach((graphic) => layer.remove(graphic));

  const graphics = input.geometriesTable.flatMap((geometry) => {
    if (!geometry.points?.length) return [];
    const graphic = createGeometryGraphic(geometry, {
      symbolOptions: yellowGeometrySymbol,
      attributes: {
        geometryId: geometry.id,
        geometryType: geometry.type,
        omschrijving: geometry.omschrijving,
        type: "geometry",
      },
    });
    return graphic ? [graphic as Graphic] : [];
  });
  if (graphics.length) layer.addMany(graphics);
}

export function goToTablePoint(input: {
  mapView: __esri.MapView | null | undefined;
  longitude: number;
  latitude: number;
  zoom?: number;
}) {
  if (!validateMapView(input.mapView) || !input.mapView) return;
  input.mapView.zoom = input.zoom ?? 15;
  input.mapView.goTo(
    new Point({
      longitude: input.longitude,
      latitude: input.latitude,
    })
  );
}

export function goToGeometryCenter(input: {
  mapView: __esri.MapView | null | undefined;
  points: Array<{ longitude: number; latitude: number }>;
  zoom?: number;
}) {
  if (!validateMapView(input.mapView) || !input.mapView || !input.points.length) {
    return;
  }

  const center = input.points.reduce(
    (sum, point) => ({
      longitude: sum.longitude + point.longitude,
      latitude: sum.latitude + point.latitude,
    }),
    { longitude: 0, latitude: 0 }
  );

  input.mapView.zoom = input.zoom ?? 12;
  input.mapView.goTo(
    new Point({
      longitude: center.longitude / input.points.length,
      latitude: center.latitude / input.points.length,
      spatialReference: { wkid: 4326 },
    })
  );
}
