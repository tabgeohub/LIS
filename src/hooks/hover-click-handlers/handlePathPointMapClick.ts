import { FinishedFlightPlanType } from "Types/finished_plans";
import type { PathPointType } from "@helpers/ZustandStates/pathPointState";
import {
  addSelectedPathHighlight,
  clearSelectedPathHighlights,
} from "./pathPointGraphics";
import { parsePlanPath } from "./pathPlanUtils";
import { resolveSelectedPathPoint } from "./resolveSelectedPathPoint";

export function handlePathPointMapClick(input: {
  map: __esri.Map;
  redGraphicsLayer: __esri.GraphicsLayer;
  plan: FinishedFlightPlanType;
  planPath: ReturnType<typeof parsePlanPath>;
  latitude: number;
  longitude: number;
  maxDistanceM: number;
  setSelectedPathPoint: (value: PathPointType | null) => void;
}): void {
  input.map.reorder(
    input.redGraphicsLayer,
    input.map.layers.length - 1
  );

  const selection = resolveSelectedPathPoint({
    plan: input.plan,
    planPath: input.planPath,
    latitude: input.latitude,
    longitude: input.longitude,
    maxDistanceM: input.maxDistanceM,
  });

  if (!selection) {
    input.setSelectedPathPoint(null);
    clearSelectedPathHighlights(input.redGraphicsLayer);
    return;
  }

  const { nearest, ...selectedPathPoint } = selection;
  input.setSelectedPathPoint(selectedPathPoint);
  addSelectedPathHighlight(input.redGraphicsLayer, nearest);
}
