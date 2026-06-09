import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useCreateData } from "utils/useCreateData";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { buildReuseFlightPlanPointIds } from "./helpers/buildReusePlanPointIds";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";

export default function Buttons() {
  const {
    clear,
    setStep,
    currentPoints,
    currentGeometries,
    newPoints,
    newGeometries,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    geplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    doelEnHoofdthema,
    aanvullendeInfo,
    vluchtnummer,
    selectedPlan,
  } = useReuseFlightPlan();
  const { user } = useAuth();
  const { dbGeometries } = useGeometriesStore();
  const { create, loading } = useCreateData(`/flightPlans`);
  const { selectedLayers } = kaartlagenState();
  const { selectedBasemap } = useSelectedBasemapState();
  const { graphicsLayer } = useMapViewState();
  const handleCancel = useHandleCancel();
  const { logStep, labels } = useWizardButtons("Second step");

  const handleSubmit = () => {
    const points = buildReuseFlightPlanPointIds(
      currentPoints,
      newPoints,
      currentGeometries,
      newGeometries,
      dbGeometries,
      selectedPlan?.geometries ?? []
    );

    const newPlan = {
      vluchtnummer,
      omschrijving,
      waarnemer,
      piloot,
      datum,
      vliegduur: geplandeVliegduur,
      luchtvaartuig: typeLuchtvaartuig,
      passagiers: aantalPassagiers,
      hoofdthema: doelEnHoofdthema,
      aanvullende: aanvullendeInfo,
      points,
      basemap: selectedBasemap,
      layers: selectedLayers.join(","),
      user_id: user.user_id,
      status: "pre-prepared",
      copiedFrom: selectedPlan?.id,
      regio_id: user.role,
    };

    create(newPlan, () => {
      graphicsLayer?.graphics.removeAll();
      clear();
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
              runWizardCleanup([
                () => graphicsLayer?.graphics.removeAll(),
                () => setStep(1),
                clear,
              ]),
          },
          {
            label: labels.opslaan,
            disabled: !vluchtnummer || !datum,
            onClick: handleSubmit,
          },
          {
            label: labels.annuleren,
            onClick: () => runWizardCleanup([() => handleCancel(), clear]),
          },
        ]}
      />
      <WizardLoadingOverlay show={loading} variant="stacked" />
    </>
  );
}
