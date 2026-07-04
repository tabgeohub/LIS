import dayjs from "dayjs";
import { FinishedFlightPlanType } from "Types/finished_plans";
import {
  addPlanHighlightGraphics,
  TIMESLIDER_HIGHLIGHT_LABEL,
} from "./timesliderHighlightGraphics";

export { TIMESLIDER_HIGHLIGHT_LABEL };

/** Newest first (inspectiedatum, then created_at as fallback). */
export function sortPlansNewestFirst(plans: FinishedFlightPlanType[]) {
  return [...plans].sort((a, b) => {
    const ta = dayjs(a.datum || a.created_at).valueOf();
    const tb = dayjs(b.datum || b.created_at).valueOf();
    const sa = Number.isFinite(ta) ? ta : 0;
    const sb = Number.isFinite(tb) ? tb : 0;
    return sb - sa;
  });
}

export function removeTimesliderHighlights(layer: __esri.GraphicsLayer) {
  layer.graphics
    .toArray()
    .filter((g) => g.attributes?.label === TIMESLIDER_HIGHLIGHT_LABEL)
    .forEach((g) => layer.remove(g));
}

export function drawSelectedPlansYellowHighlights(
  layer: __esri.GraphicsLayer,
  plans: FinishedFlightPlanType[],
  selectedPlanIds: number[]
) {
  addPlanHighlightGraphics({ layer, plans, selectedPlanIds });
}
