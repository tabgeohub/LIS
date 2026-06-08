import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { useState } from "react";
import { FlightPlanType } from "Types";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { usePrepreparedFlightPlans } from "api-hooks/flightPlans";
import Buttons from "./Buttons";
import Step2 from "./Step2";
import { useContent } from "hooks/useContent";

export default function StepNo() {
  const [subStep, setSubStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<FlightPlanType | null>(null);

  const { selectedPoint } = useDeletePointState();
  const { user } = useAuth();

  const { data: prepreparedFlightPlans } = usePrepreparedFlightPlans(
    user.role,
    user.user_id
  );

  const content = useContent();

  if (!prepreparedFlightPlans) return null;

  const filteredPlans = prepreparedFlightPlans.filter(
    (plan) => !plan.points.flatMap((p) => p.id).includes(selectedPoint?.id!)
  );

  return (
    <div className="p-1">
      {subStep === 1 && (
        <>
          <p className="text-[12px] mb-2">
            {content.tools.aandachtspuntenVerwijderen.addToPlan.title}
          </p>

          <input
            type="text"
            placeholder="Filter resultaten"
            className="inputClass"
          />

          <div className="bg-gray-200 w-full h-[1px] mt-2" />

          <div className="h-[48vh] overflow-y-scroll thin-scrollbar divide-y-2">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() =>
                  selectedPlan === null
                    ? setSelectedPlan(plan)
                    : setSelectedPlan(null)
                }
                className={`flex items-center text-[12px] gap-x-2 py-1.5 pl-6 cursor-pointer transition-all ${
                  selectedPlan === plan ? "bg-gray-200" : "hover:bg-blue-100"
                }`}
              >
                <p>{plan.omschrijving}</p>
              </div>
            ))}
          </div>

          <Buttons selectedPlan={selectedPlan!} setSubStep={setSubStep} />
        </>
      )}

      {subStep === 2 && <Step2 selectedPlan={selectedPlan!} />}
    </div>
  );
}
