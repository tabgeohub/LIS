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

type TableGeometry = {
  id: number;
  type?: string;
  omschrijving?: string;
  points?: Array<{ longitude: number; latitude: number }>;
};

function clearGeometryGraphics(layer: __esri.GraphicsLayer): void {
  layer.graphics
    .toArray()
    .filter((graphic) => graphic.attributes?.type === "geometry")
    .forEach((graphic) => layer.remove(graphic));
}

function buildYellowGeometryGraphics(
  geometriesTable: TableGeometry[]
): Graphic[] {
  return geometriesTable.flatMap((geometry) => {
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
}

export function syncYellowGeometryTableGraphics(input: {
  mapView: __esri.MapView | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  geometriesTable: TableGeometry[] | null | undefined;
}) {
  const layer = input.yellowGraphicsLayer;
  if (!validateMapView(input.mapView, layer) || !layer || !input.geometriesTable?.length) {
    return;
  }

  clearGeometryGraphics(layer);
  const graphics = buildYellowGeometryGraphics(input.geometriesTable);
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

function averagePointCenter(
  points: Array<{ longitude: number; latitude: number }>
): { longitude: number; latitude: number } {
  const sum = points.reduce(
    (acc, point) => ({
      longitude: acc.longitude + point.longitude,
      latitude: acc.latitude + point.latitude,
    }),
    { longitude: 0, latitude: 0 }
  );
  return {
    longitude: sum.longitude / points.length,
    latitude: sum.latitude / points.length,
  };
}

function canGoToGeometryCenter(input: {
  mapView: __esri.MapView | null | undefined;
  points: Array<{ longitude: number; latitude: number }>;
}): input is {
  mapView: __esri.MapView;
  points: Array<{ longitude: number; latitude: number }>;
} {
  return Boolean(
    validateMapView(input.mapView) && input.mapView && input.points.length
  );
}

export function goToGeometryCenter(input: {
  mapView: __esri.MapView | null | undefined;
  points: Array<{ longitude: number; latitude: number }>;
  zoom?: number;
}) {
  if (!canGoToGeometryCenter(input)) return;

  const center = averagePointCenter(input.points);
  input.mapView.zoom = input.zoom ?? 12;
  input.mapView.goTo(
    new Point({
      longitude: center.longitude,
      latitude: center.latitude,
      spatialReference: { wkid: 4326 },
    })
  );
}
