import { useAuth } from "hooks/zustand/ui";
import { useReuseFlightPlan } from "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan";
import { useCreateData } from "api-hooks/mutations";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { useMapViewState } from "hooks/zustand/ui";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useGeometriesStore } from "hooks/features";
import { buildReuseFlightPlanPointIds } from "./helpers/buildReusePlanPointIds";
import { assembleFlightPlanCreateAttributes } from "Components/HomePage/hooks/flightPlan/assembleFlightPlanCreateAttributes";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";

export default function Buttons() {
  const store = useReuseFlightPlan();
  const {
    clear,
    setStep,
    currentPoints,
    currentGeometries,
    newPoints,
    newGeometries,
    vluchtnummer,
    selectedPlan,
  } = store;
  const { user } = useAuth();
  const { dbGeometries } = useGeometriesStore();
  const { create, loading } = useCreateData(`/flightPlans`);
  const { selectedLayers } = kaartlagenState();
  const { selectedBasemap } = useSelectedBasemapState();
  const { graphicsLayer } = useMapViewState();
  const handleCancel = useHandleCancel();
  const { logStep, labels } = useWizardButtons("Second step");

  const handleSubmit = () => {
    const points = buildReuseFlightPlanPointIds({
      currentPoints,
      newPoints,
      currentGeometryIds: currentGeometries,
      newGeometryIds: newGeometries,
      dbGeometries,
      planGeometries: selectedPlan?.geometries ?? [],
    });

    const newPlan = assembleFlightPlanCreateAttributes({
      store,
      points,
      basemap: selectedBasemap,
      layers: selectedLayers,
      userId: user.user_id,
      regioId: user.role,
      copiedFrom: selectedPlan?.id,
    });

    create({
      data: newPlan,
      onSuccess: () => {
        graphicsLayer?.graphics.removeAll();
        clear();
      },
    });

    logStep("User clicked 'Save' button to save copied flight plan data", {
      ...newPlan,
    });
  };

  return (
    <>
      <WizardButtonBar
        buttons={[
          {
            label: labels.vorige,
            onClick: () =>
              runWizardCleanup({ actions: [
                () => graphicsLayer?.graphics.removeAll(),
                () => setStep(1),
                clear,
              ] }),
          },
          {
            label: labels.opslaan,
            disabled: !vluchtnummer || !store.datum,
            onClick: handleSubmit,
          },
          {
            label: labels.annuleren,
            onClick: () => runWizardCleanup({ actions: [() => handleCancel(), clear] }),
          },
        ]}
      />
      <WizardLoadingOverlay show={loading} variant="stacked" />
    </>
  );
}
