import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";
import { buildPinGraphics } from "./pinGraphics";

export type CreatePinInput = {
  point: EnrichedPointType | FinishedPointType;
  mapView: __esri.MapView;
  label?: string;
};

export function createPin(input: CreatePinInput) {
  const { point, mapView, label } = input;
  const graphics = buildPinGraphics({
    longitude: point.longitude,
    latitude: point.latitude,
    pointId: point.id,
    label,
  });
  mapView.graphics.addMany([graphics.outerGraphic, graphics.pinGraphic]);
  return graphics;
}
