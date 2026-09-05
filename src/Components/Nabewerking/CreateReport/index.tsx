import Loading from "Components/Common/FlightPlanListLoading";
import Step1 from "./Steps/Step1";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import Step1Buttons from "./Steps/Step1/Buttons";
import Step2Buttons from "./Steps/Step2/Buttons";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { renderWizardStep } from "Components/Common/Wizard/renderWizardStep";
import { usePartialFinishedPlans } from "api-hooks/finishedPlans";
import { useCreateReportState } from "Components/Nabewerking/CreateReport/state/useCreateReportState";
import { useAuth } from "hooks/zustand/ui";

export default function CreateReport() {
  const { user } = useAuth();

  const { data: plans, isPending: loading } = usePartialFinishedPlans(
    user.role
  );

  const { step, selectedPlan } = useCreateReportState();

  const buttons = renderWizardStep(step, {
    1: <Step1Buttons />,
    2: <Step2Buttons />,
  });

  return (
    <div className="h-full">
      {loading && <Loading />}

      {!loading && plans && (
        <ScrollButtonsLayout className="h-full" buttons={buttons}>
          {renderWizardStep(step, {
            1: <Step1 plans={plans} />,
            2: selectedPlan ? <Step2 /> : null,
            3: selectedPlan ? <Step3 /> : null,
          })}
        </ScrollButtonsLayout>
      )}
    </div>
  );
}
