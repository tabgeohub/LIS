import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useAuth } from "hooks/zustand/ui/useAuth";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";
import { buildCreatePointPayload } from "Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/helpers/buildCreatePointPayload";
import { useFetchInitialFeatures } from "Components/HomePage/hooks/features/useFetchInitialFeatures";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import { useEnrichedPointState } from "hooks/zustand/useEnrichedPointState";
import { useCreateData } from "utils/useCreateData";

export default function Buttons({ handleCancel }: { handleCancel: () => void }) {
  const { redGraphicsLayer } = useMapViewState();
  const { user } = useAuth();
  const pointState = useEnrichedPointState();
  const { fetchInitialFeatures } = useFetchInitialFeatures();
  const { create } = useCreateData("/points");
  const { logStep, labels } = useWizardButtons("Third step");

  async function handleSubmit() {
    await create({ data: buildCreatePointPayload({ point: pointState, user }) });
    fetchInitialFeatures(user.role);
    logStep("User clicked 'Save' button to save point data", {
      omschrijving: pointState.omschrijving,
      activiteit: pointState.activiteit,
      organisatie: pointState.organisatie,
      specifiekLettenOp: pointState.specifiekLettenOp,
    });
    redGraphicsLayer?.removeAll();
    pointState.reset();
  }

  function handleBack() {
    redGraphicsLayer?.removeAll();
    pointState.reset();
  }

  return (
    <WizardButtonBar
      className={WIZARD_BUTTON_BAR_CLASS}
      buttons={[
        { label: labels.vorige, onClick: handleBack },
        { label: labels.update, onClick: () => pointState.setStep(2) },
        {
          label: labels.opslaan,
          onClick: handleSubmit,
          disabled:
            pointState.omschrijving === "" || pointState.organisatie === "",
        },
        { label: labels.annuleren, onClick: handleCancel },
      ]}
    />
  );
}
