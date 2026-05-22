/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect, useRef, useState } from "react";
import { FlightPlanType } from "Types";
import { createQuadrantGraphic } from "../../../Voorbereiding/ViewPlan/helpers/createQuadrantGraphic";
import FlightPlansList from "./FlightPlansList";
import FlightPlanDetails from "./FlightPlanDetails";

export default function FlightPlans({
  setFase,
  flightPlansData,
}: {
  setFase: (value: string) => void;
  flightPlansData: FlightPlanType[];
}) {
  const originalGraphicsMap = useRef<Map<string, __esri.Graphic>>(new Map());
  const [flightPlanDetails, setFlightPlanDetails] = useState(false);
  const [flightPlan, setFlightPlan] = useState<FlightPlanType | null>(null);

  const { mapView, graphicsLayer } = useMapViewState();

  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  }>();

  const popupRef = useRef<HTMLDivElement | null>(null);
  const hasRunStar = useRef(false);

  useEffect(() => {
    if (hasRunStar.current) return;
    if (mapView && graphicsLayer) {
      graphicsLayer.removeAll();

      flightPlansData?.forEach((plan) => {
        const quadrantGraphic = createQuadrantGraphic(plan.points);

        quadrantGraphic.attributes = { id: plan.id };
        graphicsLayer.add(quadrantGraphic);

        originalGraphicsMap.current.set(String(plan.id), quadrantGraphic);
      });
    }
  }, [flightPlansData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setClickedPointPosition(undefined);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {!flightPlanDetails && (
        <FlightPlansList
          flightPlansData={flightPlansData}
          setFase={setFase}
          setFlightPlan={setFlightPlan}
          setFlightPlanDetails={setFlightPlanDetails}
          setClickedPointPosition={setClickedPointPosition}
          popupRef={popupRef}
          originalGraphicsMap={originalGraphicsMap}
          clickedPointPosition={clickedPointPosition!}
          flightPlan={flightPlan}
        />
      )}

      {flightPlanDetails && flightPlan && (
        <FlightPlanDetails
          flightPlan={flightPlan}
          setFlightPlanDetails={setFlightPlanDetails}
        />
      )}
    </div>
  );
}
