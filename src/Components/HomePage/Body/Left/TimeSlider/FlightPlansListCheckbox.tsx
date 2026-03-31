import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaMapMarkedAlt } from "react-icons/fa";
import { LuWaypoints } from "react-icons/lu";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import Point from "@arcgis/core/geometry/Point";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";

const TIMESLIDER_HIGHLIGHT_LABEL = "timeslider-selected-plan-highlight";

/** Newest first (inspectiedatum, then created_at as fallback). */
function sortPlansNewestFirst(plans: FinishedFlightPlanType[]) {
  return [...plans].sort((a, b) => {
    const ta = dayjs(a.datum || a.created_at).valueOf();
    const tb = dayjs(b.datum || b.created_at).valueOf();
    const sa = Number.isFinite(ta) ? ta : 0;
    const sb = Number.isFinite(tb) ? tb : 0;
    return sb - sa;
  });
}

function removeTimesliderHighlights(layer: __esri.GraphicsLayer) {
  layer.graphics
    .toArray()
    .filter((g) => g.attributes?.label === TIMESLIDER_HIGHLIGHT_LABEL)
    .forEach((g) => layer.remove(g));
}

export default function FlightPlansListCheckbox() {
  const { user } = useAuth();
  const { yellowGraphicsLayer } = useMapViewState();
  const {
    dateFrom,
    dateTo,
    plans,
    setPlans,
    setSelectedPlanIds,
    selectedPlanIds,
    togglePlan,
  } = useTimesliderState();
  const [loading, setLoading] = useState(false);
  const selectedIds = new Set(selectedPlanIds);

  useEffect(() => {
    if (!dateFrom || !dateTo || !user?.role) {
      setPlans([]);
      setSelectedPlanIds([]);
      return;
    }
    const fromStr = dayjs(dateFrom).format("YYYY-MM-DD");
    const toStr = dayjs(dateTo).format("YYYY-MM-DD");
    setLoading(true);
    axios
      .get<FinishedFlightPlanType[]>(
        `${getBackEndUrl()}/api/timeslider/getFinishedPlansTimeslider`,
        {
          params: { regio_id: user.role, from: fromStr, to: toStr },
        }
      )
      .then((res) => setPlans(sortPlansNewestFirst(res.data || [])))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo, user?.role, setPlans, setSelectedPlanIds]);

  useEffect(() => {
    if (!yellowGraphicsLayer) return;

    removeTimesliderHighlights(yellowGraphicsLayer);

    if (selectedPlanIds.length === 0 || plans.length === 0) return;

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
        yellowGraphicsLayer.add(
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
          .map((p) => getPointCoordinates(p, true))
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

          yellowGraphicsLayer.add(
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
          yellowGraphicsLayer.add(
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
  }, [plans, selectedPlanIds, yellowGraphicsLayer]);

  const hasRange = !!dateFrom && !!dateTo;

  return (
    <div className="h-full overflow-auto">
      {!hasRange && (
        <p className="text-[12px] text-gray-400 px-2 py-2">
          Selecteer een periode met de timeslider.
        </p>
      )}
      {hasRange && loading && (
        <p className="text-[12px] text-gray-400 px-2 py-2">Laden...</p>
      )}
      {hasRange && !loading && plans.length === 0 && (
        <p className="text-[12px] text-gray-400 px-2 py-2">
          Er zijn geen vluchtplannen in deze periode.
        </p>
      )}
      {hasRange && !loading && plans.length > 0 && (
        <div className="divide-y-2">
          {plans.map((plan) => (
            <label
              key={plan.id}
              className="p-2 hover:bg-gray-100 transition-all relative flex items-start gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(plan.id)}
                onChange={() => togglePlan(plan.id)}
                className="mt-1.5 shrink-0"
              />
              <div className="flex-1 min-w-0 relative">
                <div className="flex items-center gap-x-2">
                  <FaMapMarkedAlt className="size-6 text-blue-500 shrink-0" />
                  <p className="text-[12px]">{plan.vluchtnummer}</p>
                </div>
                <div className="text-[10px] text-gray-500 mt-2">
                  <p>Omschrijving: {plan.omschrijving}</p>
                  <p>Doel en hoofdthema: {plan.hoofdthema}</p>
                  <p>Aanvullende informatie: {plan.aanvullende}</p>
                  <p>
                    Inspectiedatum: {dayjs(plan.datum).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className="absolute mt-4 bottom-0 right-4">
                  <LuWaypoints className="size-4 text-gray-500" />
                  <span className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
                    {(plan.points_data?.length || 0) +
                      (plan.geometries?.length || 0)}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
