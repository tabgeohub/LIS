import Map from "@arcgis/core/Map";
import { RefObject } from "react";
import { createNetherlandsMapBounds } from "./netherlandsMapBounds";
import {
  addAndOrderMapGraphicsLayers,
  createMapGraphicsLayers,
} from "./mapGraphicsLayers";
import { createConfiguredMapView } from "./mapViewConfiguration";

export default function createMapView(mapDiv: RefObject<HTMLDivElement>) {
  const bounds = createNetherlandsMapBounds();
  const map = new Map({ basemap: "topo-vector" });
  const mapView = createConfiguredMapView({
    container: mapDiv.current,
    map,
    extent: bounds.extent,
    polygon: bounds.polygon,
  });
  const layers = createMapGraphicsLayers();
  addAndOrderMapGraphicsLayers(map, layers);

  return {
    map,
    mapView,
    ...layers,
  };
}
