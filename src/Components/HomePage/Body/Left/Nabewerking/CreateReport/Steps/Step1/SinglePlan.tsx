import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  FinishedFlightPlanType,
  FinishedGeometryType,
} from "Types/finished_plans";
import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { FaMapMarkedAlt } from "react-icons/fa";

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

export default function SinglePlan({ plan }: { plan: FinishedFlightPlanType }) {
  const logAction = useLogAction();

  const { selectedPlan, setSelectedPlan } = useCreateReportState();

  const { graphicsLayerHover, graphicsLayer } = useMapViewState();

  const selectPlan = (plan: FinishedFlightPlanType) => {
    setSelectedPlan(plan);

    if (!graphicsLayer) return;

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
      outline: { color: [0, 255, 0, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayer.add(newPolygonGraphic);

    const centroidSymbol = new SimpleMarkerSymbol({
      color: [0, 200, 80, 0.95],
      size: 9,
      outline: { color: [0, 100, 40, 1], width: 1 },
    });
    for (const g of plan.geometries || []) {
      const c = geometryCentroid(g);
      if (!c) continue;
      const pt = new Point({
        longitude: c.lon,
        latitude: c.lat,
        spatialReference: { wkid: 4326 },
      });
      graphicsLayer.add(
        new Graphic({
          geometry: pt,
          symbol: centroidSymbol,
          attributes: { kind: "geometry-centroid" },
        })
      );
    }
  };

  const HoveredPlan = (plan: FinishedFlightPlanType) => {
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
      outline: { color: [227, 139, 79, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayerHover.add(newPolygonGraphic);

    const centroidSymbol = new SimpleMarkerSymbol({
      color: [227, 139, 79, 0.95],
      size: 9,
      outline: { color: [180, 90, 40, 1], width: 1 },
    });
    for (const g of plan.geometries || []) {
      const c = geometryCentroid(g);
      if (!c) continue;
      const pt = new Point({
        longitude: c.lon,
        latitude: c.lat,
        spatialReference: { wkid: 4326 },
      });
      graphicsLayerHover.add(
        new Graphic({
          geometry: pt,
          symbol: centroidSymbol,
          attributes: { kind: "geometry-centroid" },
        })
      );
    }
  };

  return (
    <div
      onMouseEnter={() => {
        HoveredPlan(plan);
      }}
      onMouseLeave={() => {
        graphicsLayerHover?.removeAll();
      }}
      onClick={() => {
        selectPlan(plan);

        logAction({
          message: "User clicked on a flight plan",
          step: "First step",
          newData: {
            vluchtnummer: plan.vluchtnummer,
            omschrijving: plan.omschrijving,
            waarnemer: plan.waarnemer,
            piloot: plan.piloot,
            datum: plan.datum,
            vliegduur: plan.vliegduur,
            luchtvaartuig: plan.luchtvaartuig,
            passagiers: plan.passagiers,
            hoofdthema: plan.hoofdthema,
            aanvullende: plan.aanvullende,
          },
        });
      }}
      className={`p-2 
        ${plan.status === "in-progress" && "bg-neutral-200"}
        ${selectedPlan === plan && "bg-gray-100"}
        hover:cursor-pointer hover:bg-gray-100 relative`}
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
    </div>
  );
}
