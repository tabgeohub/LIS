import Point from "@arcgis/core/geometry/Point";
import MapView from "@arcgis/core/views/MapView";
import { BaseGeometryData } from "@helpers/ArcGISHelpers/createGeometryGraphic";
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
    if (!geometry.points || geometry.points.length === 0) return;

    const graphic = createYellowGeometryTableGraphic(geometry);
    if (graphic) {
      yellowGraphicsLayer?.add(graphic);
    }

    const alreadyStarred = starredGeometries.find((g) => g.id === geometry.id);
    if (alreadyStarred && graphicsLayer) {
      addStarGeometryGraphic(geometry, graphicsLayer);
    }
  });
}
