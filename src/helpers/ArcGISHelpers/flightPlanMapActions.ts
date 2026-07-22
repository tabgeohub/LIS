import type MapView from "@arcgis/core/views/MapView";
import type { FlightPlanType } from "Types";
import { computeFlightPlanCentroid } from "./computeFlightPlanCentroid";
import { getFlightPlanPoints } from "./createPlanBoundingBoxGraphic";

export function getFlightPlanMapCenter(flightPlan: FlightPlanType) {
  return computeFlightPlanCentroid(getFlightPlanPoints(flightPlan));
}

export function zoomMapToFlightPlan(input: {
  mapView: MapView | null | undefined;
  flightPlan: FlightPlanType;
  zoom?: number;
}) {
  const { mapView, flightPlan, zoom = 8 } = input;
  if (!mapView) return;
  const center = getFlightPlanMapCenter(flightPlan);
  if (center) {
    mapView.goTo({ target: center, zoom });
  }
}

export function panMapToFlightPlan(input: {
  mapView: MapView | null | undefined;
  flightPlan: FlightPlanType;
}) {
  const { mapView, flightPlan } = input;
  if (!mapView) return;
  const center = getFlightPlanMapCenter(flightPlan);
  if (center) {
    mapView.goTo(center);
  }
}
