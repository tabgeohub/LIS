import { useState } from "react";
import { FlightPlanType } from "Types";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { usePrepreparedFlightPlans } from "hooks/queries/useFlightPlanQueries";
import Buttons from "./Buttons";

export default function StepMultiplePoints({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const [subStep, setSubStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<FlightPlanType | null>(null);
  const { user } = useAuth();

  const { data: prepreparedFlightPlans } = usePrepreparedFlightPlans(
    user.user_id
  );

  if (!prepreparedFlightPlans) return null;

  return (
    <div className="p-1">
      {subStep === 1 && (
        <>
          <p className="text-[12px] mb-2">Selecteer een vluchtplan</p>

          <input
            type="text"
            placeholder="Filter resultaten"
            className="inputClass"
          />

          <div className="bg-gray-200 w-full h-[1px] mt-2" />

          <div className="h-[48vh] overflow-y-scroll thin-scrollbar divide-y-2">
            {prepreparedFlightPlans?.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`flex items-center text-[12px] gap-x-2 py-1.5 pl-6 cursor-pointer transition-all ${
                  selectedPlan === plan ? "bg-gray-200" : "hover:bg-blue-100"
                }`}
              >
                <p>{plan.vluchtnummer}</p>
              </div>
            ))}
          </div>

          <Buttons
            selectedPlan={selectedPlan}
            setSubStep={setSubStep}
            setStep={setStep}
          />
        </>
      )}

      {subStep === 2 && (
        <>
          <div className="text-[12px] mt-2">
            Aandachtspunt(en) is/zijn toegevoegd aan vluchtplan '
            {selectedPlan?.omschrijving}'.
          </div>
        </>
      )}
    </div>
  );
}
