import PlanInformationFields from "Components/HomePage/Body/Left/Common/PlanInformationFields";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";
import type { PlanInformationProps } from "Components/HomePage/Body/Left/Common/planInformationProps";
import { goBackFromPlanInformation } from "Components/HomePage/Body/Left/Common/goBackFromPlanInformation";
import Images from "./Images";

export default function PlanInformation({
  selectedPlan,
  setSelectedPlan,
  setStep,
}: PlanInformationProps) {
  return (
    <ScrollButtonsLayout
      buttons={
        <>
          <button
            onClick={() => goBackFromPlanInformation(setStep, setSelectedPlan)}
            className="gray-button"
          >
            Vorige
          </button>
        </>
      }
    >
      <div className="space-y-3 p-3 pt-10">
        <PlanInformationFields
          plan={selectedPlan}
          urgentValue={String(selectedPlan.spoed)}
        />

        <Images selectedPlan={selectedPlan} />
      </div>
    </ScrollButtonsLayout>
  );
}
