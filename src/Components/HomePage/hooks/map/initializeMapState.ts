import type { RefObject } from "react";
import createMapView from "@helpers/ArcGISHelpers/createMapView";
import { useMapViewState } from "hooks/zustand/ui";

/** Create the ArcGIS resources and publish them to the map store atomically. */
export function initializeMapState(mapDiv: RefObject<HTMLDivElement>) {
  const resources = createMapView(mapDiv);
  useMapViewState.setState(resources);
  return resources;
}
