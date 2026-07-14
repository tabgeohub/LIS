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
    ? { click: PLAN_BOUNDING_BOX_SYMBOLS.finishedPlanClick, hover: PLAN_BOUNDING_BOX_SYMBOLS.finishedPlanHover }
    : { click: PLAN_BOUNDING_BOX_SYMBOLS.click, hover: PLAN_BOUNDING_BOX_SYMBOLS.hover };
}

export function createFinishedPlanHighlightActions(input: {
  variant: FinishedPlanMapVariant;
  selectedLayer: __esri.GraphicsLayer | null;
  hoverLayer: __esri.GraphicsLayer | null;
}) {
  const symbols = getSymbols(input.variant);
  const draw = (
    layer: __esri.GraphicsLayer | null,
    plan: FinishedFlightPlanType,
    symbol: Parameters<typeof createFinishedPlanBoundingBoxGraphic>[1],
    markerSymbol: __esri.SimpleMarkerSymbol
  ) => {
    if (!layer) return;
    const graphic = createFinishedPlanBoundingBoxGraphic(plan, symbol);
    if (!graphic) return;
    layer.add(graphic);
    addFinishedPlanGeometryCentroidMarkers({ layer, plan, symbol: markerSymbol });
  };
  return {
    handleClick: (plan: FinishedFlightPlanType, setSelectedPlan: (value: FinishedFlightPlanType | null) => void) => {
      if (!input.selectedLayer) return;
      setSelectedPlan(plan);
      input.selectedLayer.removeAll();
      draw(input.selectedLayer, plan, symbols.click, FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS.selected);
    },
    handleHover: (plan: FinishedFlightPlanType) =>
      draw(input.hoverLayer, plan, symbols.hover, FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS.hover),
    handleMouseLeave: () => input.hoverLayer?.removeAll(),
  };
}
