/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import { EnrichedPointType, FlightPlanType } from "Types";

export default function Step2({
  setStep,
  setFase,
  flightPlansData,
  pointsData,
}: {
  setStep: (value: number) => void;
  setFase: (value: string) => void;
  flightPlansData: FlightPlanType[];
  pointsData: EnrichedPointType[];
}) {
  const [filter, setFilter] = useState<string>("");
  const [filteredPlans, setFilteredPlans] =
    useState<FlightPlanType[]>(flightPlansData);
  const [selectedPlan, setSelectedPlan] = useState<FlightPlanType>();

  useEffect(() => {
    setFilteredPlans(
      flightPlansData.filter((plan) => plan.vluchtnummer.includes(filter))
    );
  }, [filter]);

  return (
    <div>
      <div className="mt-2 px-2 pb-2 border-b-[2px] border-gray-100">
        <div className="text-sm text-gray-500">Selecteer een vluchtplan</div>
        <input
          className="text-[10px] text-gray-500 border-[2px] border-gray-300 rounded-md px-2 py-1 w-full"
          type="text"
          placeholder="filter resultaten"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filteredPlans.map((plan, index) => (
        <div
          key={index}
          className="flex justify-between px-2 py-2 border-b-[2px] border-gray-100 text-sm hover:bg-blue-100 cursor-pointer"
          onClick={() => setSelectedPlan(plan)}
        >
          <div>{plan.vluchtnummer}</div>
        </div>
      ))}

      <Buttons
        setStep={setStep}
        setFase={setFase}
        selectedPlan={selectedPlan!}
        pointsData={pointsData}
      />
    </div>
  );
}
