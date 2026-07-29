import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";
import { validateMapView } from "Components/HomePage/helpers/ArcGISHelpers/validateMapView";
import { buildYellowMarkerGraphics } from "./yellowMarkerGraphics";

type PointType = EnrichedPointType | FinishedPointType;

export type SyncYellowMarkerSelectionInput = {
  mapView: __esri.MapView | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  selectedPointIds: number[];
  points: PointType[];
  onPointsDrawn?: (selectedPoints: number[]) => void;
};

export type UseDrawYellowMarkersOptions = Omit<
  SyncYellowMarkerSelectionInput,
  "mapView" | "yellowGraphicsLayer"
>;

export function syncYellowMarkerSelection(input: SyncYellowMarkerSelectionInput) {
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
