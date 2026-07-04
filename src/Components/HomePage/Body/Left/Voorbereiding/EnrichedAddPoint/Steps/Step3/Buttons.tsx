import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useEnrichedPointState } from "../../../../../../../../hooks/zustand/useEnrichedPointState";
import { useCreateData } from "utils/useCreateData";
import { useFetchInitialFeatures } from "hooks/features/useFetchInitialFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";

export default function Buttons({
  handleCancel,
}: {
  handleCancel: () => void;
}) {
  const { redGraphicsLayer } = useMapViewState();
  const { user } = useAuth();
  const { fetchInitialFeatures } = useFetchInitialFeatures();
  const { create } = useCreateData("/points");
  const { logStep, labels } = useWizardButtons("Third step");

  const {
    omschrijving,
    activiteit,
    organisatie,
    specifiekLettenOp,
    setStep,
    xCoord,
    yCoord,
    latitude,
    longitude,
    vertrouwelijk,
    herhalen,
    reset,
  } = useEnrichedPointState();

  async function handleSubmit() {
    await create({
      data: {
        omschrijving,
        regio_id: user?.role,
        xcoordinaat_rd: xCoord,
        ycoordinaat_rd: yCoord,
        latitude,
        longitude,
        vertrouwelijk: vertrouwelijk ? 1 : 0,
        herhalen: herhalen ? 1 : 0,
        user_id: user?.user_id,
        activiteit_id: activiteit,
        organisatie_id: organisatie,
        specifiek_letten_op: specifiekLettenOp,
      },
    });

    fetchInitialFeatures(user?.role);
    logStep("User clicked 'Save' button to save point data", {
      omschrijving,
      activiteit,
      organisatie,
      specifiekLettenOp,
    });
    redGraphicsLayer?.removeAll();
    reset();
  }

  function handleBack() {
    redGraphicsLayer?.removeAll();
    reset();
  }

  return (
    <WizardButtonBar
      className={WIZARD_BUTTON_BAR_CLASS}
      buttons={[
        { label: labels.vorige, onClick: handleBack },
        { label: labels.update, onClick: () => setStep(2) },
        {
          label: labels.opslaan,
          onClick: handleSubmit,
          disabled: omschrijving === "" || organisatie === "",
        },
        { label: labels.annuleren, onClick: handleCancel },
      ]}
    />
  );
}
