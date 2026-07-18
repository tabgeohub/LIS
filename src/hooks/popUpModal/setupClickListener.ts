import { EnrichedPointType } from "Types";
import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";
import { handleMapClickHit } from "./mapClickHitHandler";
import { clearSelectedPointGraphics } from "./pointHitSelection";

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
  const { mapView, selectedPointGraphicsLayer } = input;
  if (!mapView) return;

  const clickGuard = createDebouncedClickGuard();
  const clickHandler = mapView.on("click", async (event) => {
    await handleMapClickHit({
      mapView,
      event,
      setClickedPointId: input.setClickedPointId,
      setClickedPoint: input.setClickedPoint,
      selectedPointGraphicsLayer,
      createNewPoint: input.createNewPoint,
      pointsGraphicsLayer: input.pointsGraphicsLayer,
      isTabBlocked: input.isTabBlocked,
      shouldSkip: () => clickGuard.shouldSkip(),
      finishGuard: () => clickGuard.finish(),
    });
  });

  return () => {
    clearSelectedPointGraphics(selectedPointGraphicsLayer);
    clickHandler.remove();
  };
};
