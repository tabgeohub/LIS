import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { buildYellowMarkerGraphics } from "./yellowMarkerGraphics";

type PointType = EnrichedPointType | FinishedPointType;

export function syncYellowMarkerSelection(input: {
  mapView: __esri.MapView | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  selectedPointIds: number[];
  points: PointType[];
  onPointsDrawn?: (selectedPoints: number[]) => void;
}) {
  if (
    !validateMapView(input.mapView, input.yellowGraphicsLayer) ||
    !input.yellowGraphicsLayer
  ) {
    return;
  }

  input.yellowGraphicsLayer.graphics.removeAll();

  if (!input.selectedPointIds?.length) {
    input.onPointsDrawn?.([]);
    return;
  }

  input.yellowGraphicsLayer.addMany(
    buildYellowMarkerGraphics(input.points, input.selectedPointIds)
  );
  input.onPointsDrawn?.(input.selectedPointIds);
}
