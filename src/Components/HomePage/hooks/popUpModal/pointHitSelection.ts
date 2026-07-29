import { initialPointState } from "hooks/zustand/ui";
import { EnrichedPointType } from "Types";

export function clearSelectedPointGraphics(
  selectedPointGraphicsLayer: __esri.GraphicsLayer
) {
  selectedPointGraphicsLayer.removeAll();
}

export function applyPointHitSelection(input: {
  clickedGraphics: __esri.Graphic[];
  setClickedPointId: (value: number) => void;
  setClickedPoint: (value: EnrichedPointType) => void;
  selectedPointGraphicsLayer: __esri.GraphicsLayer;
}) {
  if (input.clickedGraphics.length === 0) {
    input.setClickedPointId(0);
    input.setClickedPoint(initialPointState);
    clearSelectedPointGraphics(input.selectedPointGraphicsLayer);
    return;
  }

  const g = input.clickedGraphics.find(
    (gr) =>
      // @ts-ignore
      gr?.attributes && typeof (gr as any).attributes?.id === "number"
  ) as __esri.Graphic | undefined;

  // @ts-ignore
  const id = g?.attributes?.id as number | undefined;
  if (typeof id === "number") {
    input.setClickedPointId(id);
    return;
  }

  input.setClickedPointId(0);
  input.setClickedPoint(initialPointState);
  clearSelectedPointGraphics(input.selectedPointGraphicsLayer);
}

export function graphicsFromHitTest(
  response: __esri.HitTestResult
): __esri.Graphic[] {
  return response.results
    .filter((result) => (result as __esri.GraphicHit).graphic)
    .map((result) => (result as __esri.GraphicHit).graphic);
}
