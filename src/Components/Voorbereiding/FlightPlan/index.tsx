/* eslint-disable react-hooks/exhaustive-deps */
import { useFlightPlanState } from "Components/Voorbereiding/FlightPlan/useFlightPlanState";
import { renderWizardStep } from "Components/Common/Wizard/renderWizardStep";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step1 from "./Steps/Step1";
import TemplateFlight from "./Steps/Step1/TemplateFlights";

export default function FlightPlan({
  basemapString,
}: {
  basemapString: string;
}) {
  const { step } = useFlightPlanState();

  return (
    <div className="h-full">
      {renderWizardStep(step, {
        1: <Step1 />,
        2: <TemplateFlight basemapString={basemapString} />,
        3: <Step2 />,
        4: <Step3 basemapString={basemapString} />,
      })}
    </div>
  );
}
