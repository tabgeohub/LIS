import dayjs from "dayjs";
import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import Point from "@arcgis/core/geometry/Point";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { FinishedFlightPlanType } from "Types/finished_plans";

export const TIMESLIDER_HIGHLIGHT_LABEL = "timeslider-selected-plan-highlight";

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
  const selectedIdsSet = new Set(selectedPlanIds);
  const selectedPlans = plans.filter((p) => selectedIdsSet.has(p.id));

  const pointSymbol = new SimpleMarkerSymbol({
    color: [255, 213, 0, 0.95],
    size: 11,
    style: "circle",
    outline: { color: [255, 255, 255, 1], width: 2 },
  });

  const lineSymbol = new SimpleLineSymbol({
    color: [255, 213, 0, 0.95],
    width: 3,
    style: "solid",
  });

  const polygonSymbol = new SimpleFillSymbol({
    color: [255, 213, 0, 0.2],
    outline: { color: [255, 213, 0, 0.95], width: 3 },
    style: "solid",
  });

  for (const plan of selectedPlans) {
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

    for (const g of plan.geometries || []) {
      const path = (g.points || [])
        .map((pt) => getPointCoordinates(pt, true))
        .filter(
          (c): c is { longitude: number; latitude: number } => c != null
        )
        .map((c) => [c.longitude, c.latitude] as [number, number]);

      if (path.length < 2) continue;

      const type = (g.geometry_type || "").toLowerCase();
      const isPolygon = type.includes("polygon");

      if (isPolygon && path.length >= 3) {
        const ring = [...path];
        const [firstX, firstY] = ring[0];
        const [lastX, lastY] = ring[ring.length - 1];
        if (firstX !== lastX || firstY !== lastY) ring.push([firstX, firstY]);

        layer.add(
          new Graphic({
            geometry: new Polygon({
              rings: [ring],
              spatialReference: { wkid: 4326 },
            }),
            symbol: polygonSymbol,
            attributes: {
              label: TIMESLIDER_HIGHLIGHT_LABEL,
              kind: "geometry",
              geometryType: "polygon",
              planId: plan.id,
              geometryId: g.id,
            },
          })
        );
      } else {
        layer.add(
          new Graphic({
            geometry: new Polyline({
              paths: [path],
              spatialReference: { wkid: 4326 },
            }),
            symbol: lineSymbol,
            attributes: {
              label: TIMESLIDER_HIGHLIGHT_LABEL,
              kind: "geometry",
              geometryType: "line",
              planId: plan.id,
              geometryId: g.id,
            },
          })
        );
      }
    }
  }
}
