import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { PLAN_BOUNDING_BOX_SYMBOLS } from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import {
  addFinishedPlanGeometryCentroidMarkers,
  createFinishedPlanBoundingBoxGraphic,
  FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS,
} from "@helpers/ArcGISHelpers/finishedPlanMapGraphics";
import { FinishedFlightPlanType } from "Types/finished_plans";

export type FinishedPlanMapVariant = "createReport" | "vluchtenZoeken";

function getBoundingBoxSymbols(variant: FinishedPlanMapVariant) {
  if (variant === "vluchtenZoeken") {
    return {
      click: PLAN_BOUNDING_BOX_SYMBOLS.finishedPlanClick,
      hover: PLAN_BOUNDING_BOX_SYMBOLS.finishedPlanHover,
    };
  }

  return {
    click: PLAN_BOUNDING_BOX_SYMBOLS.click,
    hover: PLAN_BOUNDING_BOX_SYMBOLS.hover,
  };
}

export function useFinishedPlanMapHighlight(
  variant: FinishedPlanMapVariant = "createReport"
) {
  const { graphicsLayer, graphicsLayerHover } = useMapViewState();
  const symbols = getBoundingBoxSymbols(variant);

  function handleClick(
    plan: FinishedFlightPlanType,
    setSelectedPlan: (value: FinishedFlightPlanType | null) => void
  ) {
    if (!graphicsLayer) return;

    setSelectedPlan(plan);
    graphicsLayer.removeAll();

    const boundingGraphic = createFinishedPlanBoundingBoxGraphic(
      plan,
      symbols.click
    );

    if (!boundingGraphic) return;

    graphicsLayer.add(boundingGraphic);
    addFinishedPlanGeometryCentroidMarkers(
      graphicsLayer,
      plan,
      FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS.selected
    );
  }

  function handleHover(plan: FinishedFlightPlanType) {
    if (!graphicsLayerHover) return;

    const boundingGraphic = createFinishedPlanBoundingBoxGraphic(
      plan,
      symbols.hover
    );

    if (!boundingGraphic) return;

    graphicsLayerHover.add(boundingGraphic);
    addFinishedPlanGeometryCentroidMarkers(
      graphicsLayerHover,
      plan,
      FINISHED_PLAN_GEOMETRY_MARKER_SYMBOLS.hover
    );
  }

  function handleMouseLeave() {
    graphicsLayerHover?.removeAll();
  }

  return {
    handleClick,
    handleHover,
    handleMouseLeave,
  };
}
