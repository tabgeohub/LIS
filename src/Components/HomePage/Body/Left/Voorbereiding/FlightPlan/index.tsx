/* eslint-disable react-hooks/exhaustive-deps */
import { useFlightPlanState } from "./helpers/flightPlanStates";

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
      {step === 1 && <Step1 />}

      {step === 2 && <TemplateFlight basemapString={basemapString} />}

      {step === 3 && <Step2 />}

      {step === 4 && <Step3 basemapString={basemapString} />}
    </div>
  );
}
