import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { RefObject } from "react";

import Extent from "@arcgis/core/geometry/Extent";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import Polygon from "@arcgis/core/geometry/Polygon";

export default function createMapView(mapDiv: RefObject<HTMLDivElement>) {
  const nlPolygonWGS84 = new Polygon({
    spatialReference: { wkid: 4326 },
    rings: [
      [
        [3.8460910856539243, 53.81426843834605],
        [7.852439640112755, 53.684339986202524],
        [6.746481710653153, 50.62111706044792],
        [2.8280251264390306, 50.96833816802285],
        [3.8460910856539243, 53.81426843834605],
      ],
    ],
  });

  const nlPolygonWM = webMercatorUtils.geographicToWebMercator(
    nlPolygonWGS84
  ) as Polygon;

  const nlExtent = new Extent({
    xmin: 2.8280251264390306,
    ymin: 50.62111706044792,
    xmax: 7.852439640112755,
    ymax: 53.81426843834605,
    spatialReference: { wkid: 4326 },
  });

  const nlExtentWM = webMercatorUtils.geographicToWebMercator(
    nlExtent
  ) as Extent;

  const map = new Map({ basemap: "topo-vector" });

  const mapView = new MapView({
    container: mapDiv.current,
    map,
    extent: nlExtentWM.toJSON(),
    constraints: {
      geometry: nlPolygonWM,
      minZoom: 6,
      maxZoom: 18,
      rotationEnabled: false,
      // @ts-expect-error: available on supported 4.x versions
      wrapAroundEnabled: false,
    },
    navigation: { momentumEnabled: false },
  });

  const anyView = mapView as any;
  if ("clippingArea" in anyView) {
    anyView.clippingArea = nlPolygonWM;
    if ("clipToGeometryEnabled" in anyView)
      anyView.clipToGeometryEnabled = true;
  }

  const graphicsLayer = new GraphicsLayer();
  const graphicsLayerHover = new GraphicsLayer();
  const pointsGraphicsLayer = new GraphicsLayer({
    title: "Aandachtspunten",
  });
  const yellowGraphicsLayer = new GraphicsLayer();
  const redGraphicsLayer = new GraphicsLayer();
  const selectedPointGraphicsLayer = new GraphicsLayer();
  const geometriesGraphicsLayer = new GraphicsLayer({
    title: "Geometries",
  });

  mapView.map.add(pointsGraphicsLayer);
  mapView.map.add(yellowGraphicsLayer);
  mapView.map.add(graphicsLayer);
  mapView.map.add(geometriesGraphicsLayer);
  mapView.map.add(graphicsLayerHover);
  mapView.map.add(redGraphicsLayer);
  mapView.map.add(selectedPointGraphicsLayer);

  map.layers.reorder(graphicsLayerHover, map.layers.length - 1);
  map.layers.reorder(yellowGraphicsLayer, map.layers.length - 2);
  map.layers.reorder(redGraphicsLayer, map.layers.length - 3);
  map.layers.reorder(graphicsLayer, map.layers.length - 4);
  map.layers.reorder(geometriesGraphicsLayer, map.layers.length - 5);
  map.layers.reorder(selectedPointGraphicsLayer, map.layers.length - 6);

  return {
    map,
    mapView,
    graphicsLayer,
    graphicsLayerHover,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
    redGraphicsLayer,
    selectedPointGraphicsLayer,
    geometriesGraphicsLayer,
  };
}
