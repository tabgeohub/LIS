import { EnrichedPointType } from "Types";
import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";
import {
  applyPointHitSelection,
  clearSelectedPointGraphics,
  graphicsFromHitTest,
} from "./pointHitSelection";

export type SetupClickListenerInput = {
  mapView: __esri.MapView;
  setClickedPointId: (value: number) => void;
  setClickedPoint: (value: EnrichedPointType) => void;
  selectedPointGraphicsLayer: __esri.GraphicsLayer;
  createNewPoint: boolean;
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
  isTabBlocked?: () => boolean;
};

export const setupClickListener = (input: SetupClickListenerInput) => {
  const {
    mapView,
    setClickedPointId,
    setClickedPoint,
    selectedPointGraphicsLayer,
    createNewPoint,
    pointsGraphicsLayer,
    isTabBlocked,
  } = input;

  if (!mapView) {
    return;
  }

  let clickGuard = createDebouncedClickGuard();

  const clickHandler = mapView.on("click", async (event) => {
    if (isTabBlocked?.()) return;
    if (clickGuard.shouldSkip()) return;

    try {
      const includeLayers = pointsGraphicsLayer
        ? [pointsGraphicsLayer]
        : undefined;

      const response = await mapView.hitTest(
        event,
        includeLayers ? { include: includeLayers } : undefined
      );

      if (!createNewPoint) {
        applyPointHitSelection({
          clickedGraphics: graphicsFromHitTest(response),
          setClickedPointId,
          setClickedPoint,
          selectedPointGraphicsLayer,
        });
      }
    } catch (error) {
      console.error("Error querying features:", error);
    } finally {
      clickGuard.finish();
    }
  });

  return () => {
    clearSelectedPointGraphics(selectedPointGraphicsLayer);
    clickHandler.remove();
  };
};
