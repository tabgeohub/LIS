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

function shouldIgnoreMapClick(input: MapClickHitInput): boolean {
  return Boolean(input.isTabBlocked?.() || input.shouldSkip());
}

function hitTestIncludeLayers(
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined
): __esri.GraphicsLayer[] | undefined {
  return pointsGraphicsLayer ? [pointsGraphicsLayer] : undefined;
}

function applySelectionIfNeeded(
  input: MapClickHitInput,
  response: __esri.HitTestResult
): void {
  if (input.createNewPoint) return;
  applyPointHitSelection({
    clickedGraphics: graphicsFromHitTest(response),
    setClickedPointId: input.setClickedPointId,
    setClickedPoint: input.setClickedPoint,
    selectedPointGraphicsLayer: input.selectedPointGraphicsLayer,
  });
}

export async function handleMapClickHit(
  input: MapClickHitInput
): Promise<void> {
  if (shouldIgnoreMapClick(input)) return;

  try {
    const includeLayers = hitTestIncludeLayers(input.pointsGraphicsLayer);
    const response = await input.mapView.hitTest(
      input.event,
      includeLayers ? { include: includeLayers } : undefined
    );
    applySelectionIfNeeded(input, response);
  } catch (error) {
    console.error("Error querying features:", error);
  } finally {
    input.finishGuard();
  }
}
