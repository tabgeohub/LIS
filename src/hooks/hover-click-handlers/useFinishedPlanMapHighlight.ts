import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  createFinishedPlanHighlightActions,
  FinishedPlanMapVariant,
} from "./finishedPlanHighlightActions";

export type { FinishedPlanMapVariant } from "./finishedPlanHighlightActions";

export function useFinishedPlanMapHighlight(
  variant: FinishedPlanMapVariant = "createReport"
) {
  const { graphicsLayer, graphicsLayerHover } = useMapViewState();
  return createFinishedPlanHighlightActions({
    variant,
    selectedLayer: graphicsLayer,
    hoverLayer: graphicsLayerHover,
  });
}
