import type MapView from "@arcgis/core/views/MapView";
import type { FlightPlanType } from "Types";
import { computeFlightPlanCentroid } from "./computeFlightPlanCentroid";
import { getFlightPlanPoints } from "./createPlanBoundingBoxGraphic";

export function getFlightPlanMapCenter(flightPlan: FlightPlanType) {
  return computeFlightPlanCentroid(getFlightPlanPoints(flightPlan));
}

export function zoomMapToFlightPlan(
  mapView: MapView | null | undefined,
  flightPlan: FlightPlanType,
  zoom = 8
) {
  if (!mapView) return;
  const center = getFlightPlanMapCenter(flightPlan);
  if (center) {
    mapView.goTo({ target: center, zoom });
  }
}

export function panMapToFlightPlan(
  mapView: MapView | null | undefined,
  flightPlan: FlightPlanType
) {
  if (!mapView) return;
  const center = getFlightPlanMapCenter(flightPlan);
  if (center) {
    mapView.goTo(center);
  }
}
