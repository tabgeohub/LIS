import Point from "@arcgis/core/geometry/Point";
import MapView from "@arcgis/core/views/MapView";
import { BaseGeometryData } from "Components/HomePage/helpers/ArcGISHelpers/createGeometryGraphic";
import {
  calculateGeometryCentroid,
  createStarGeometryGraphic,
  createYellowGeometryTableGraphic,
} from "./geometryMapGraphicFactories";

export function addStarGeometryGraphic(
  geometry: BaseGeometryData,
  layer: __esri.GraphicsLayer
) {
  const graphic = createStarGeometryGraphic(geometry);
  if (graphic) {
    layer.graphics.add(graphic);
  }
}

export function removeStarGeometryGraphic(
  geometryId: number | string,
  layer: __esri.GraphicsLayer | null | undefined
) {
  if (!layer) return;

  const toRemove = layer.graphics.find(
    (graphic) => graphic.attributes?.geometryId === geometryId
  );
  if (toRemove) {
    layer.graphics.remove(toRemove);
  }
}

export function goToGeometryCentroid(
  mapView: MapView | null | undefined,
  geometry: BaseGeometryData
) {
  if (!mapView) return;

  const centroid = calculateGeometryCentroid(geometry);
  if (!centroid) return;

  const centerPoint = new Point({
    longitude: centroid.longitude,
    latitude: centroid.latitude,
    spatialReference: { wkid: 4326 },
  });

  mapView.goTo(centerPoint);
  mapView.zoom = 12;
}

function hasGeometryPoints(geometry: BaseGeometryData): boolean {
  return Boolean(geometry.points && geometry.points.length > 0);
}

function syncOneGeometryTableGraphic(input: {
  geometry: BaseGeometryData;
  starredGeometries: BaseGeometryData[];
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayer?: __esri.GraphicsLayer | null | undefined;
}) {
  if (!hasGeometryPoints(input.geometry)) return;

  const graphic = createYellowGeometryTableGraphic(input.geometry);
  if (graphic) {
    input.yellowGraphicsLayer?.add(graphic);
  }

  const alreadyStarred = input.starredGeometries.find(
    (g) => g.id === input.geometry.id
  );
  if (!alreadyStarred || !input.graphicsLayer) return;
  addStarGeometryGraphic(input.geometry, input.graphicsLayer);
}

export function syncGeometriesTableMapGraphics({
  geometries,
  starredGeometries = [],
  yellowGraphicsLayer,
  graphicsLayer,
}: {
  geometries: BaseGeometryData[];
  starredGeometries?: BaseGeometryData[];
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayer?: __esri.GraphicsLayer | null | undefined;
}) {
  geometries.forEach((geometry) => {
    syncOneGeometryTableGraphic({
      geometry,
      starredGeometries,
      yellowGraphicsLayer,
      graphicsLayer,
    });
  });
}
