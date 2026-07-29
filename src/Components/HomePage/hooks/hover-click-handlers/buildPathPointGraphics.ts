import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { FinishedFlightPlanType } from "Types/finished_plans";
import type { PathPoint } from "./pathPlanUtils";

export function buildPathPointGraphics(input: {
  selectedPlan: FinishedFlightPlanType;
  planPath: PathPoint[];
}) {
  return input.planPath.map(
    (p, index) =>
      new Graphic({
        geometry: new Point({
          longitude: p.longitude,
          latitude: p.latitude,
        }),
        symbol: new SimpleMarkerSymbol({
          color: "red",
          outline: { color: "black", width: 0.5 },
          size: "6px",
        }),
        attributes: {
          OBJECTID: index,
          planId: input.selectedPlan.id,
          vluchtnummer: input.selectedPlan.vluchtnummer,
          ...p,
        },
      })
  );
}
