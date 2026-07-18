import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import { buildPathPointGraphics } from "./buildPathPointGraphics";
import {
  PATH_FEATURE_LAYER_FIELDS,
  PATH_FEATURE_LAYER_RENDERER,
} from "./pathFeatureLayerConfig";
import type { PathPoint } from "./pathPlanUtils";

export function buildPathFeatureLayer(input: {
  selectedPlan: FinishedFlightPlanType;
  planPath: PathPoint[];
}) {
  return new FeatureLayer({
    source: buildPathPointGraphics(input),
    fields: PATH_FEATURE_LAYER_FIELDS,
    objectIdField: "OBJECTID",
    geometryType: "point",
    spatialReference: { wkid: 4326 },
    title: "PathPoints",
    renderer: PATH_FEATURE_LAYER_RENDERER,
  });
}

export { addPathLayerBelowPoints } from "./addPathLayerBelowPoints";
