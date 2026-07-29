import { PLAN_BOUNDING_BOX_SYMBOLS } from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import {
  addFinishedPlanGeometryCentroidMarkers,
  createFinishedPlanBoundingBoxGraphic,
} from "@helpers/ArcGISHelpers/finishedPlanMapGraphics";
import { FinishedFlightPlanType } from "Types/finished_plans";

export type FinishedPlanMapVariant = "createReport" | "vluchtenZoeken";

export function getFinishedPlanHighlightSymbols(variant: FinishedPlanMapVariant) {
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

export function drawFinishedPlanHighlight(input: DrawFinishedPlanHighlightInput) {
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
