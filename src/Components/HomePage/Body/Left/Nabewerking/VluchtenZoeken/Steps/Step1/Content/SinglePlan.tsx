import Polygon from "@arcgis/core/geometry/Polygon";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { LuWaypoints } from "react-icons/lu";
import {
  FinishedFlightPlanType,
  FinishedGeometryType,
} from "Types/finished_plans";

function geometryCentroid(
  g: FinishedGeometryType
): { lat: number; lon: number } | null {
  if (!g.points?.length) return null;
  let sumLat = 0;
  let sumLon = 0;
  let n = 0;
  for (const p of g.points) {
    if (typeof p.latitude === "number" && typeof p.longitude === "number") {
      sumLat += p.latitude;
      sumLon += p.longitude;
      n++;
    }
  }
  if (n === 0) return null;
  return { lat: sumLat / n, lon: sumLon / n };
}

function collectPlanLatLon(plan: FinishedFlightPlanType): { lat: number; lon: number }[] {
  const out: { lat: number; lon: number }[] = [];
  for (const p of plan.points_data || []) {
    if (typeof p.latitude === "number" && typeof p.longitude === "number") {
      out.push({ lat: p.latitude, lon: p.longitude });
    }
  }
  for (const g of plan.geometries || []) {
    const c = geometryCentroid(g);
    if (c) out.push(c);
  }
  return out;
}

function addGeometryCentroidMarkers(
  layer: __esri.GraphicsLayer,
  plan: FinishedFlightPlanType,
  symbol: SimpleMarkerSymbol
) {
  for (const g of plan.geometries || []) {
    const c = geometryCentroid(g);
    if (!c) continue;
    const pt = new Point({
      longitude: c.lon,
      latitude: c.lat,
      spatialReference: { wkid: 4326 },
    });
    layer.add(
      new Graphic({
        geometry: pt,
        symbol,
        attributes: { kind: "geometry-centroid" },
      })
    );
  }
}

export default function SinglePlan({ plan }: { plan: FinishedFlightPlanType }) {
  const { graphicsLayerHover, graphicsLayer } = useMapViewState();
  const [polygonGraphic, setPolygonGraphic] = useState<Graphic | null>(null);

  const { selectedPlan, setSelectedPlan } = useFinishedPlansState();

  const logAction = useLogAction();

  function handleHover() {
    if (!graphicsLayerHover) return;

    const coords = collectPlanLatLon(plan);
    if (coords.length === 0) return;

    const minLat = Math.min(...coords.map((c) => c.lat));
    const maxLat = Math.max(...coords.map((c) => c.lat));
    const minLon = Math.min(...coords.map((c) => c.lon));
    const maxLon = Math.max(...coords.map((c) => c.lon));

    const polygon = new Polygon({
      rings: [
        [
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat],
          [minLon, maxLat],
        ],
      ],
      spatialReference: { wkid: 4326 },
    });

    const fillSymbol = new SimpleFillSymbol({
      color: [227, 139, 79, 0],
      outline: { color: [0, 255, 0, 0.1], width: 5 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayerHover.add(newPolygonGraphic);
    setPolygonGraphic(newPolygonGraphic);

    const centroidSymbol = new SimpleMarkerSymbol({
      color: [227, 139, 79, 0.95],
      size: 9,
      outline: { color: [180, 90, 40, 1], width: 1 },
    });
    addGeometryCentroidMarkers(graphicsLayerHover, plan, centroidSymbol);
  }

  function handleMouseLeave() {
    if (graphicsLayerHover && polygonGraphic) {
      graphicsLayerHover.removeAll();
      setPolygonGraphic(null);
    }
  }

  function handleClick() {
    if (!graphicsLayer) return;

    setSelectedPlan(plan);

    graphicsLayer.removeAll();

    const coords = collectPlanLatLon(plan);
    if (coords.length === 0) return;

    const minLat = Math.min(...coords.map((c) => c.lat));
    const maxLat = Math.max(...coords.map((c) => c.lat));
    const minLon = Math.min(...coords.map((c) => c.lon));
    const maxLon = Math.max(...coords.map((c) => c.lon));

    const polygon = new Polygon({
      rings: [
        [
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat],
          [minLon, maxLat],
        ],
      ],
      spatialReference: { wkid: 4326 },
    });

    const fillSymbol = new SimpleFillSymbol({
      color: [227, 139, 79, 0],
      outline: { color: [0, 255, 0, 0.7], width: 5 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayer.add(newPolygonGraphic);
    setPolygonGraphic(newPolygonGraphic);

    const centroidSymbol = new SimpleMarkerSymbol({
      color: [0, 200, 80, 0.95],
      size: 9,
      outline: { color: [0, 100, 40, 1], width: 1 },
    });
    addGeometryCentroidMarkers(graphicsLayer, plan, centroidSymbol);

    logAction({
      message: `User clicked on flight plan ${plan.vluchtnummer}`,
      step: "First step",
    });
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      className={`p-2 hover:bg-gray-100 ${selectedPlan?.id === plan.id && "bg-gray-200"
        } transition-all cursor-pointer relative`}
    >
      <div className="flex items-center gap-x-2">
        <FaMapMarkedAlt className="size-6 text-blue-500" />
        <p className="text-[12px]">{plan.vluchtnummer}</p>
      </div>

      <div className="text-[10px] text-gray-500 mt-2">
        <p>Omschrijving: {plan.omschrijving}</p>
        <p>Doel en hoofdthema: {plan.hoofdthema}</p>
        <p>Aanvullende informatie: {plan.aanvullende}</p>
        <p>Inspectiedatum: {dayjs(plan.datum).format("YYYY-MM-DD")}</p>
      </div>

      <div className="absolute mt-4 bottom-0 right-4">
        <LuWaypoints className="size-4 text-gray-500" />
        <div className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
          {plan.points_data.length + plan.geometries.length}
        </div>
      </div>
    </div>
  );
}
