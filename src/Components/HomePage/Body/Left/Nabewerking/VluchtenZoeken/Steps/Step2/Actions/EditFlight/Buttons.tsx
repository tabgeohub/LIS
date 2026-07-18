import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { ActionType } from "../..";
import { buildFlightPlanPayloadFields } from "hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useUpdateData } from "utils/useUpdateData";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import { pickFlightPlanFormValues } from "hooks/flightPlan/pickFlightPlanCreateFields";
import {
  mergeFlightPlanPersistenceFields,
  pickFlightPlanPersistenceFields,
} from "hooks/flightPlan/pickFlightPlanPersistenceFields";

export default function Buttons({
  setAction,
}: {
  setAction: (action: ActionType) => void;
}) {
  const store = useFinishedPlansState();
  const { selectedPlan, setSelectedPlan } = store;
  const { user } = useAuth();
  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans`);
  const { logStep, withLog, labels } = useWizardButtons("Second step - Edit flight");

  function handleSubmit() {
    if (!selectedPlan) return;

    const attributes = {
      vluchtnummer: selectedPlan.vluchtnummer,
      ...buildFlightPlanPayloadFields(pickFlightPlanFormValues(store)),
      points: selectedPlan.points_data.flatMap((point) => point.id),
      user_id: user.user_id,
      status: selectedPlan.status,
      id: selectedPlan.id,
    };

    update({ data: attributes, onSuccess: (responseData) => {
      setSelectedPlan(
        mergeFlightPlanPersistenceFields(selectedPlan, responseData.result)
      );
      setAction("none");
    },});

    logStep(
      "User clicked 'Save' button to edit flight plan data",
      pickFlightPlanPersistenceFields(selectedPlan)
    );
  }

  return (
    <>
      <WizardButtonBar
        className="flex justify-end gap-x-1 text-[12px] mt-2"
        buttons={[
          {
            label: labels.vorige,
            onClick: withLog("User clicked 'Previous' button", () => setAction("none")),
          },
          {
            label: labels.opslaan,
            onClick: handleSubmit,
          },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", () => setAction("none")),
          },
        ]}
      />
      <WizardLoadingOverlay show={loading} variant="offset" />
    </>
  );
}
