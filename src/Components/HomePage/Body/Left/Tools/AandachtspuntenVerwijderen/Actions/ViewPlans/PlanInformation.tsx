import PlanInformationFields from "Components/HomePage/Body/Left/Common/PlanInformationFields";
import { FlightPlanType } from "Types";

export default function PlanInformation({
  selectedPlan,
  setSelectedPlan,
  setStep,
}: {
  selectedPlan: FlightPlanType;
  setSelectedPlan: (value: FlightPlanType | null) => void;
  setStep: (value: number) => void;
}) {
  return (
    <div className="space-y-3 p-3">
      <PlanInformationFields
        plan={selectedPlan}
        urgentValue={selectedPlan.spoed ? "Ja" : "Nee"}
      />

      <div className="flex justify-end gap-x-1 text-[12px] !mt-6">
        <button
          onClick={() => {
            setStep(1);
            setSelectedPlan(null);
          }}
          className="gray-button"
        >
          Vorige
        </button>

        <button className="gray-button">Annuleren</button>
      </div>
    </div>
  );
}
