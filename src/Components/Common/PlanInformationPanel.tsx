import type { ReactNode } from "react";
import PlanInformationFields from "Components/Common/PlanInformationFields";
import type { PlanInformationProps } from "Components/Common/planInformationProps";
import { goBackFromPlanInformation } from "Components/Common/goBackFromPlanInformation";
import { formatPlanSpoedLabel } from "Components/Common/formatPlanSpoedLabel";
import ScrollButtonsLayout from "./ScrollButtonsLayout";

type PlanInformationPanelProps = PlanInformationProps & {
  layout?: "plain" | "scroll";
  children?: ReactNode;
};

export function PlanInformationPanel({
  selectedPlan,
  setSelectedPlan,
  setStep,
  layout = "plain",
  children,
}: PlanInformationPanelProps) {
  const fields = (
    <PlanInformationFields
      plan={selectedPlan}
      urgentValue={formatPlanSpoedLabel(selectedPlan.spoed)}
    />
  );

  const backButton = (
    <button
      onClick={() => goBackFromPlanInformation(setStep, setSelectedPlan)}
      className="gray-button"
    >
      Vorige
    </button>
  );

  if (layout === "scroll") {
    return (
      <ScrollButtonsLayout buttons={<>{backButton}</>}>
        <div className="space-y-3 p-3 pt-10">
          {fields}
          {children}
        </div>
      </ScrollButtonsLayout>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {fields}
      <div className="flex justify-end gap-x-1 text-[12px] !mt-6">
        {backButton}
        <button className="gray-button">Annuleren</button>
      </div>
    </div>
  );
}
