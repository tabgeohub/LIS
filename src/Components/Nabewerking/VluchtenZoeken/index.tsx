import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import PeriodFilter from "./PeriodFilter";
import { renderWizardStep } from "Components/Common/Wizard/renderWizardStep";
import { useFinishedPlansState } from "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState";

export default function VluchtenZoeken() {
  const { openFilter, step } = useFinishedPlansState();

  if (openFilter) {
    return (
      <div className="h-full">
        <PeriodFilter />
      </div>
    );
  }

  return (
    <div className="h-full">
      {renderWizardStep(step, {
        1: <Step1 />,
        2: <Step2 />,
      })}
    </div>
  );
}
