import { initialPointState } from "@helpers/ZustandStates/popUpState";
import { EnrichedPointType } from "Types";

export const setupClickListener = (
  mapView: __esri.MapView,
  setClickedPointId: (value: number) => void,
  setClickedPoint: (value: EnrichedPointType) => void,
  selectedPointGraphicsLayer: __esri.GraphicsLayer,
  createNewPoint: boolean,
  pointsGraphicsLayer?: __esri.GraphicsLayer | null,
  isTabBlocked?: () => boolean
) => {
  if (!mapView) {
    return;
  }

  let isProcessing = false;
  let lastClickTime = 0;
  const DEBOUNCE_MS = 150;

  const clickHandler = mapView.on("click", async (event) => {
    if (isTabBlocked && isTabBlocked()) {
      return;
    }

    const now = Date.now();
    if (now - lastClickTime < DEBOUNCE_MS) {
      return;
    }
    lastClickTime = now;

    if (isProcessing) {
      return;
    }
    isProcessing = true;

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
      isProcessing = false;
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
