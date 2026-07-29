import { useMapViewState } from "hooks/zustand/ui";
import type { EnrichedPointType } from "Types";
import { SelectFromSourceItem } from "./helpers/mapSourceItems";
import {
  useBluePointRendering,
  useSelectionPins,
  useSelectFromSourceGraphicsLifecycle,
  useSourcePointHover,
} from "./useSelectFromSourceGraphicsEffects";

export function useSelectFromSourceMapEffects(input: {
  selectedItem: SelectFromSourceItem | null;
  selectedPointIds: number[];
  planPointIds: Set<number>;
  dbPoints: EnrichedPointType[];
}) {
  const { pointsGraphicsLayer, mapView } = useMapViewState();
  const refs = useSelectFromSourceGraphicsLifecycle({
    selectedItem: input.selectedItem,
    mapView,
    pointsGraphicsLayer,
  });
  useBluePointRendering({ ...input, mapView, pointsGraphicsLayer, ...refs });
  useSelectionPins({ ...input, mapView, ...refs });
  useSourcePointHover({
    selectedItem: input.selectedItem,
    mapView,
    pointsGraphicsLayer,
    ...refs,
  });
}
