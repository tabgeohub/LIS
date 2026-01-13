import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { FaMapMarkedAlt } from "react-icons/fa";

export default function SinglePlan({ plan }: { plan: FinishedFlightPlanType }) {
  const logAction = useLogAction();

  const { selectedPlan, setSelectedPlan } = useCreateReportState();

  const { graphicsLayerHover, graphicsLayer } = useMapViewState();

  const selectPlan = (plan: FinishedFlightPlanType) => {
    setSelectedPlan(plan);

    if (!graphicsLayer) return;

    setSelectedPlan(plan);

    graphicsLayer.removeAll();

    const points = plan?.points_data;
    if (!points || points.length === 0) return;

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
      outline: { color: [0, 255, 0, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayer.add(newPolygonGraphic);
  };

  const HoveredPlan = (plan: FinishedFlightPlanType) => {
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
      outline: { color: [227, 139, 79, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayerHover.add(newPolygonGraphic);
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
