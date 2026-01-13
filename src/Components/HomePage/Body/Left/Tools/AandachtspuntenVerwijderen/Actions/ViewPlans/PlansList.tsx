import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";

import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { useEffect, useMemo, useState } from "react";
import { FlightPlanType } from "Types";

dayjs.locale("nl");

export default function PlansList({
  plans,
  selectedPlan,
  setSelectedPlan,
  setStep,
  step,
}: {
  plans: FlightPlanType[];
  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;
  setStep: (value: number) => void;
  step: number;
}) {
  const { setMainStep } = useDeletePointState();
  const [filter, setFilter] = useState("");

  const logAction = useLogAction();

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.vluchtnummer.toLowerCase().includes(filter.toLowerCase())
    );
  }, [plans, filter]);

  // Set filter to empty string when plans change
  useEffect(() => {
    setFilter("");
  }, [plans, step]);

  return (
    <div className="h-full">
      <>
        <input
          type="text"
          placeholder="Filter resultaten"
          className="inputClass mt-2 !p-1 placeholder:text-[12px]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="w-full h-[1px] bg-gray-200 mt-2" />
      </>

      <div className="w-full h-[83%] overflow-y-auto thin-scrollbar divide-y-2">
        {filteredPlans?.map((plan) => (
          <div
            key={`${plan.id}-${plan.vluchtnummer}`}
            onClick={() => setSelectedPlan(plan)}
            className={`text-[14px] px-5 py-1 cursor-pointer transition-all ${
              selectedPlan?.id === plan.id ? "bg-gray-100" : "hover:bg-blue-100"
            }`}
          >
            <div className="flex gap-x-2 items-center font-medium">
              <p>vluchtplan: </p>
              <p>{plan.vluchtnummer}</p>
            </div>

            <div className="flex gap-x-2 items-center text-gray-500">
              <p>datum: </p>
              <p className="capitalize">
                {dayjs(plan.datum).format("DD MMM YYYY")}
              </p>
            </div>

            <div className="flex gap-x-2 items-center text-gray-500">
              <p>Aanvullende Informatie: </p>
              <p>{plan.aanvullende}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-x-1 text-[12px]">
        <button
          onClick={() => {
            setStep(2);

            logAction({
              message: "User clicked 'Next' button",
              step: "View plans",
            });
          }}
          disabled={!selectedPlan}
          className="gray-button"
        >
          Volgende
        </button>

        <button
          onClick={() => {
            setMainStep("main");

            logAction({
              message: "User clicked 'Cancel' button",
              step: "View plans",
            });
          }}
          className="gray-button"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}
