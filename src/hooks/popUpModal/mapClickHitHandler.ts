import { EnrichedPointType } from "Types";
import {
  applyPointHitSelection,
  graphicsFromHitTest,
} from "./pointHitSelection";

/** Shared click-listener fields used by setupClickListener + handleMapClickHit. */
export type MapClickListenerBase = {
  mapView: __esri.MapView;
  setClickedPointId: (value: number) => void;
  setClickedPoint: (value: EnrichedPointType) => void;
  selectedPointGraphicsLayer: __esri.GraphicsLayer;
  createNewPoint: boolean;
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
  isTabBlocked?: () => boolean;
};

export type MapClickHitInput = MapClickListenerBase & {
  event: __esri.ViewClickEvent;
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
