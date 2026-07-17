import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { addPlanGeometryHighlights } from "./timesliderGeometryHighlights";
import { TIMESLIDER_HIGHLIGHT_LABEL } from "./timesliderHighlightLabel";

export { TIMESLIDER_HIGHLIGHT_LABEL } from "./timesliderHighlightLabel";

const pointSymbol = new SimpleMarkerSymbol({
  color: [255, 213, 0, 0.95],
  size: 11,
  style: "circle",
  outline: { color: [255, 255, 255, 1], width: 2 },
});

function addPlanPointHighlights(
  layer: __esri.GraphicsLayer,
  plan: FinishedFlightPlanType
) {
  for (const p of plan.points_data || []) {
    const coords = getPointCoordinates(p, true);
    if (!coords) continue;
    layer.add(
      new Graphic({
        geometry: new Point({
          longitude: coords.longitude,
          latitude: coords.latitude,
          spatialReference: { wkid: 4326 },
        }),
        symbol: pointSymbol,
        attributes: {
          label: TIMESLIDER_HIGHLIGHT_LABEL,
          kind: "point",
          planId: plan.id,
          pointId: p.id,
        },
      })
    );
  }
}

export function addPlanHighlightGraphics(input: {
  layer: __esri.GraphicsLayer;
  plans: FinishedFlightPlanType[];
  selectedPlanIds: number[];
}) {
  const selectedIdsSet = new Set(input.selectedPlanIds);
  const selectedPlans = input.plans.filter((p) => selectedIdsSet.has(p.id));

  for (const plan of selectedPlans) {
    addPlanPointHighlights(input.layer, plan);
    addPlanGeometryHighlights(input.layer, plan);
  }
}
