import { FlightPlanType } from "Types";
import Header from "./Header";
import List from "./List";
import { useState } from "react";

export default function FlightPlansList({
  flightPlansData,
  setFase,
  setFlightPlan,
  setFlightPlanDetails,
  setClickedPointPosition,
  popupRef,
  originalGraphicsMap,
  clickedPointPosition,
  flightPlan,
}: {
  flightPlansData: FlightPlanType[];
  setFase: (value: string) => void;
  setFlightPlan: (value: FlightPlanType | null) => void;
  setFlightPlanDetails: (value: boolean) => void;
  setClickedPointPosition: (value: { top: number; left: number }) => void;
  popupRef: React.MutableRefObject<HTMLDivElement | null>;
  originalGraphicsMap: React.MutableRefObject<Map<string, __esri.Graphic>>;
  clickedPointPosition: {
    top: number;
    left: number;
  };
  flightPlan: FlightPlanType | null;
}) {
  const [starredPlans, setStarredPlans] = useState<FlightPlanType[]>([]);

  return (
    <div className="relative">
      <Header
        flightPlansData={flightPlansData}
        setFase={setFase}
        starredPlans={starredPlans}
        setStarredPlans={setStarredPlans}
      />

      <List
        flightPlansData={flightPlansData}
        originalGraphicsMap={originalGraphicsMap}
        setFlightPlanDetails={setFlightPlanDetails}
        setClickedPointPosition={setClickedPointPosition}
        popupRef={popupRef}
        clickedPointPosition={clickedPointPosition}
        flightPlan={flightPlan}
        setFlightPlan={setFlightPlan}
        starredPlans={starredPlans}
        setStarredPlans={setStarredPlans}
      />
    </div>
  );
}
