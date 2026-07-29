import { FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS } from "Components/HomePage/helpers/ArcGISHelpers/finishedPlanMapGraphics";
import { FinishedFlightPlanType } from "Types/finished_plans";
import {
  drawFinishedPlanHighlight,
  getFinishedPlanHighlightSymbols,
  type FinishedPlanMapVariant,
} from "./finishedPlanHighlightDraw";

export type { FinishedPlanMapVariant };

export function createFinishedPlanHighlightActions(input: {
  variant: FinishedPlanMapVariant;
  selectedLayer: __esri.GraphicsLayer | null;
  hoverLayer: __esri.GraphicsLayer | null;
}) {
  const symbols = getFinishedPlanHighlightSymbols(input.variant);
  return {
    handleClick: (
      plan: FinishedFlightPlanType,
      setSelectedPlan: (value: FinishedFlightPlanType | null) => void
    ) => {
      if (!input.selectedLayer) return;
      setSelectedPlan(plan);
      input.selectedLayer.removeAll();
      drawFinishedPlanHighlight({
        layer: input.selectedLayer,
        plan,
        symbol: symbols.click,
        markerSymbol: FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS.selected,
      });
    },
    handleHover: (plan: FinishedFlightPlanType) =>
      drawFinishedPlanHighlight({
        layer: input.hoverLayer,
        plan,
        symbol: symbols.hover,
        markerSymbol: FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS.hover,
      }),
    handleMouseLeave: () => input.hoverLayer?.removeAll(),
  };
}
