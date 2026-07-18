import { PLAN_BOUNDING_BOX_SYMBOLS } from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import {
  addFinishedPlanGeometryCentroidMarkers,
  createFinishedPlanBoundingBoxGraphic,
  FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS,
} from "@helpers/ArcGISHelpers/finishedPlanMapGraphics";
import { FinishedFlightPlanType } from "Types/finished_plans";

export type FinishedPlanMapVariant = "createReport" | "vluchtenZoeken";

function getSymbols(variant: FinishedPlanMapVariant) {
  return variant === "vluchtenZoeken"
    ? {
        click: PLAN_BOUNDING_BOX_SYMBOLS.finishedPlanClick,
        hover: PLAN_BOUNDING_BOX_SYMBOLS.finishedPlanHover,
      }
    : {
        click: PLAN_BOUNDING_BOX_SYMBOLS.click,
        hover: PLAN_BOUNDING_BOX_SYMBOLS.hover,
      };
}

type DrawFinishedPlanHighlightInput = {
  layer: __esri.GraphicsLayer | null;
  plan: FinishedFlightPlanType;
  symbol: Parameters<typeof createFinishedPlanBoundingBoxGraphic>[1];
  markerSymbol: __esri.SimpleMarkerSymbol;
};

function drawFinishedPlanHighlight(input: DrawFinishedPlanHighlightInput) {
  if (!input.layer) return;
  const graphic = createFinishedPlanBoundingBoxGraphic(
    input.plan,
    input.symbol
  );
  if (!graphic) return;
  input.layer.add(graphic);
  addFinishedPlanGeometryCentroidMarkers({
    layer: input.layer,
    plan: input.plan,
    symbol: input.markerSymbol,
  });
}

export function createFinishedPlanHighlightActions(input: {
  variant: FinishedPlanMapVariant;
  selectedLayer: __esri.GraphicsLayer | null;
  hoverLayer: __esri.GraphicsLayer | null;
}) {
  const symbols = getSymbols(input.variant);
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
