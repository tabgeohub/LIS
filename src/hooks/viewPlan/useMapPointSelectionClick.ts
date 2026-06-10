/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType } from "Types";
import { useEffect } from "react";

export function togglePointSelection(
  pointId: number,
  setSelectedPointIds: React.Dispatch<React.SetStateAction<number[]>>
) {
  setSelectedPointIds((prev) =>
    prev.includes(pointId)
      ? prev.filter((id) => id !== pointId)
      : [...prev, pointId]
  );
}

export function useMapPointSelectionClick({
  onPointClick,
}: {
  onPointClick: (point: EnrichedPointType) => void;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !redGraphicsLayer) return;

    const handle = mapView.on("click", async (event) => {
      event.stopPropagation();

      const hitTestResults = await mapView.hitTest(event);

      const existingFeature = hitTestResults.results.find(
        (result) => (result as __esri.GraphicHit).graphic
      );

      // @ts-ignore
      const point = existingFeature?.graphic.attributes;

      if (point) {
        onPointClick(point);
      }
    });

    return () => handle.remove();
  }, [mapView, redGraphicsLayer, onPointClick]);
}
