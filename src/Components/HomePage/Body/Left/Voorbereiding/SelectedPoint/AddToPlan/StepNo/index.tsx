import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useState } from "react";
import { FlightPlanType } from "Types";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { usePrepreparedFlightPlans } from "api-hooks/flightPlans";
import Buttons from "./Buttons";
import useLogAction from "hooks/useLogAction";

export default function StepNo({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const [subStep, setSubStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<FlightPlanType | null>(null);

  const { clickedPoint } = usePopUpState();
  const { user } = useAuth();

  const { data: prepreparedFlightPlans } = usePrepreparedFlightPlans(
    user.user_id
  );

  if (!prepreparedFlightPlans) return null;

  const filteredPlans = prepreparedFlightPlans.filter(
    (plan) => !plan.points.flatMap((p) => p.id).includes(clickedPoint.id)
  );

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
            {filteredPlans?.map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan);

                  logAction({
                    message: "User clicked a plan",
                    step: "Add to plan - Step no",
                  });
                }}
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
            {clickedPoint.omschrijving}'.
          </div>
        </>
      )}
    </div>
  );
}
