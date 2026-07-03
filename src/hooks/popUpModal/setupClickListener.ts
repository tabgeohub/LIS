import { initialPointState } from "@helpers/ZustandStates/popUpState";
import { EnrichedPointType } from "Types";
import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";

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

      const clickedGraphics = response.results
        .filter((result) => (result as __esri.GraphicHit).graphic)
        .map((result) => (result as __esri.GraphicHit).graphic);

      if (!createNewPoint) {
        if (clickedGraphics.length > 0) {
          const g = clickedGraphics.find(
            (gr) =>
              // @ts-ignore
              gr?.attributes && typeof (gr as any).attributes?.id === "number"
          ) as __esri.Graphic | undefined;

          // @ts-ignore
          const id = g?.attributes?.id as number | undefined;
          if (typeof id === "number") {
            setClickedPointId(id);
          } else {
            setClickedPointId(0);
            setClickedPoint(initialPointState);
            clearGraphics(selectedPointGraphicsLayer);
          }
        } else {
          setClickedPointId(0);
          setClickedPoint(initialPointState);
          clearGraphics(selectedPointGraphicsLayer);
        }
      }
    } catch (error) {
      console.error("Error querying features:", error);
    } finally {
      clickGuard.finish();
    }
  });

  return () => cleanupClickListener(selectedPointGraphicsLayer, clickHandler);
};

function clearGraphics(selectedPointGraphicsLayer: __esri.GraphicsLayer) {
  selectedPointGraphicsLayer.removeAll();
}

function cleanupClickListener(
  selectedPointGraphicsLayer: __esri.GraphicsLayer,
  clickHandler: __esri.Handle
) {
  clearGraphics(selectedPointGraphicsLayer);
  clickHandler.remove();
}
