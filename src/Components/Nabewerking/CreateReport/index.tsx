import Loading from "Components/Voorbereiding/ViewPlan/Common/Loading";
import Step1 from "./Steps/Step1";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Step1Buttons from "./Steps/Step1/Buttons";
import Step2Buttons from "./Steps/Step2/Buttons";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { usePartialFinishedPlans } from "api-hooks/finishedPlans";
import { useCreateReportState } from "Components/HomePage/hooks/zustand/nabewerking/useCreateReportState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useAuth } from "hooks/zustand/ui";

export default function CreateReport() {
  const { user } = useAuth();

  const { data: plans, isPending: loading } = usePartialFinishedPlans(
    user.role
  );

  const { step, selectedPlan } = useCreateReportState();

  // Render appropriate buttons based on step
  const renderButtons = () => {
    if (step === 1) return <Step1Buttons />;
    if (step === 2) return <Step2Buttons />;
    return null;
  };

  return (
    <div className="h-full">
      {loading && <Loading />}

      {!loading && plans && (
        <>
          <ScrollButtonsLayout className="h-full" buttons={renderButtons()}>
            {step === 1 && <Step1 plans={plans} />}

            {step === 2 && selectedPlan && <Step2 />}

            {step === 3 && selectedPlan && <Step3 />}
          </ScrollButtonsLayout>
        </>
      )}
    </div>
  );
}
