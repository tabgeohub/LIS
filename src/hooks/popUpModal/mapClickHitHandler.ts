import { EnrichedPointType } from "Types";
import {
  applyPointHitSelection,
  graphicsFromHitTest,
} from "./pointHitSelection";

export type MapClickHitInput = {
  mapView: __esri.MapView;
  event: __esri.ViewClickEvent;
  setClickedPointId: (value: number) => void;
  setClickedPoint: (value: EnrichedPointType) => void;
  selectedPointGraphicsLayer: __esri.GraphicsLayer;
  createNewPoint: boolean;
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
  isTabBlocked?: () => boolean;
  shouldSkip: () => boolean;
  finishGuard: () => void;
};

export async function handleMapClickHit(
  input: MapClickHitInput
): Promise<void> {
  if (input.isTabBlocked?.()) return;
  if (input.shouldSkip()) return;

  try {
    const includeLayers = input.pointsGraphicsLayer
      ? [input.pointsGraphicsLayer]
      : undefined;
    const response = await input.mapView.hitTest(
      input.event,
      includeLayers ? { include: includeLayers } : undefined
    );

    if (!input.createNewPoint) {
      applyPointHitSelection({
        clickedGraphics: graphicsFromHitTest(response),
        setClickedPointId: input.setClickedPointId,
        setClickedPoint: input.setClickedPoint,
        selectedPointGraphicsLayer: input.selectedPointGraphicsLayer,
      });
    }
  } catch (error) {
    console.error("Error querying features:", error);
  } finally {
    input.finishGuard();
  }
}
