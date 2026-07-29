import { createDebouncedClickGuard } from "Components/HomePage/hooks/map/mapClickGuard";
import type { EnrichedPointType } from "Types";

async function selectPointFromHit(input: {
  mapView: __esri.MapView;
  pointsGraphicsLayer: __esri.GraphicsLayer;
  event: __esri.ViewClickEvent;
  getPoints: () => EnrichedPointType[];
  setSelectedPoints: (points: EnrichedPointType[]) => void;
}) {
  input.event.stopPropagation();
  const hitTestResults = await input.mapView.hitTest(input.event, {
    include: [input.pointsGraphicsLayer],
  });

  const pointAttributes = (
    hitTestResults.results.find(
      (result) => (result as __esri.GraphicHit).graphic
    ) as __esri.GraphicHit | undefined
  )?.graphic?.attributes;

  if (!pointAttributes?.id) return;

  const clickedPoint = input.getPoints().find(
    (p) => p.id === pointAttributes.id
  );
  if (clickedPoint) input.setSelectedPoints([clickedPoint]);
}

/** Attach map click to select a point from the points layer; returns cleanup. */
export function attachDeletePointMapClick(input: {
  mapView: __esri.MapView;
  pointsGraphicsLayer: __esri.GraphicsLayer;
  getPoints: () => EnrichedPointType[];
  setSelectedPoints: (points: EnrichedPointType[]) => void;
}) {
  const clickGuard = createDebouncedClickGuard();

  const clickHandler = input.mapView.on("click", async (event) => {
    if (clickGuard.shouldSkip()) return;

    try {
      await selectPointFromHit({ ...input, event });
    } catch (error) {
      console.error("Error handling map click:", error);
    } finally {
      clickGuard.finish();
    }
  });

  return () => clickHandler.remove();
}
