import PlanInformationFields from "Components/HomePage/Body/Left/Common/PlanInformationFields";
import type { PlanInformationProps } from "Components/HomePage/Body/Left/Common/planInformationProps";

export default function PlanInformation({
  selectedPlan,
  setSelectedPlan,
  setStep,
}: PlanInformationProps) {
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
