import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { LuWaypoints } from "react-icons/lu";
import { FinishedFlightPlanType } from "Types/finished_plans";

export default function SinglePlan({ plan }: { plan: FinishedFlightPlanType }) {
  const { graphicsLayerHover, graphicsLayer } = useMapViewState();
  const [polygonGraphic, setPolygonGraphic] = useState<Graphic | null>(null);

  const { selectedPlan, setSelectedPlan } = useFinishedPlansState();

  const logAction = useLogAction();

  function handleHover() {
    if (!graphicsLayerHover) return;

    let points = plan?.points_data;

    if (!points) return;

    const minLat = Math.min(...points.map((p) => p.latitude));
    const maxLat = Math.max(...points.map((p) => p.latitude));
    const minLon = Math.min(...points.map((p) => p.longitude));
    const maxLon = Math.max(...points.map((p) => p.longitude));

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

    let points = plan?.points_data;

    if (!points) return;

    const minLat = Math.min(...points.map((p) => p.latitude));
    const maxLat = Math.max(...points.map((p) => p.latitude));
    const minLon = Math.min(...points.map((p) => p.longitude));
    const maxLon = Math.max(...points.map((p) => p.longitude));

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
      className={`p-2 hover:bg-gray-100 ${
        selectedPlan?.id === plan.id && "bg-gray-200"
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
          {plan.points_data.length}
        </div>
      </div>
    </div>
  );
}
