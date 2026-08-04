import { useMapViewState } from "hooks/zustand/ui";
import { useAuth } from "hooks/zustand/ui";
import { useFlightPlanState } from "Components/Voorbereiding/FlightPlan/useFlightPlanState";
import { usePointsFilterStore } from "Components/HomePage/hooks/filters/usePointsFilterStore";
import { useCreateData } from "api-hooks/mutations";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { kaartlagenState } from "Components/HomePage/hooks/kaartlagen/kaartlagenState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useGeometriesStore } from "hooks/features";
import { submitCollectedFlightPlanCreate } from "Components/HomePage/hooks/flightPlan/submitCollectedFlightPlanCreate";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";

function mergeIdLists(...lists: Array<unknown>): number[] {
  return lists.flatMap((list) => (Array.isArray(list) ? list : []));
}

function removeNonGraphicsLayers(map: __esri.Map | null | undefined): void {
  const layersToRemove = map?.layers.filter(
    (layer) => layer.type !== "graphics"
  );
  layersToRemove?.forEach((layer) => {
    map?.remove(layer);
  });
}

export default function Buttons({
  setOpenFilter,
  basemapString,
}: {
  setOpenFilter: (value: boolean) => void;
  basemapString: string;
}) {
  const { user } = useAuth();
  const { resetFilters } = usePointsFilterStore();
  const handleCancel = useCancelCreateFlightPlan();
  const {
    yellowGraphicsLayer,
    yellowGeometriesGraphicsLayer,
    clearGraphics,
    map,
  } = useMapViewState();
  const { resetFeatures } = useResetFeatures();
  const { create, loading } = useCreateData("/flightPlans");
  const { selectedLayers } = kaartlagenState();
  const { logStep, withLog, labels } = useWizardButtons("Third step");
  const store = useFlightPlanState();
  const {
    selectedPoints2,
    selectedPoints,
    selectedGeometries,
    selectedGeometries2,
    setStep,
    clear,
  } = store;
  const { dbGeometries } = useGeometriesStore();

  const handleSubmit = () => {
    submitCollectedFlightPlanCreate({
      create,
      store,
      pointIds: mergeIdLists(selectedPoints, selectedPoints2),
      geometryIds: mergeIdLists(selectedGeometries, selectedGeometries2),
      geometries: dbGeometries,
      basemap: basemapString,
      layers: selectedLayers,
      userId: user?.user_id,
      regioId: user?.role ?? "",
      onCleanup: () => {
        clear();
        clearGraphics();
      },
      beforeCreate: (attributes) =>
        logStep("User clicked 'Save' button to save flight plan data", {
          ...attributes,
        }),
    });
  };

  const handleSaveClick = () => {
    handleSubmit();
    logStep("User clicked 'Save' button");
    removeNonGraphicsLayers(map);
  };

  return (
    <>
      <WizardButtonBar
        className=""
        buttons={[
          {
            label: labels.vorige,
            onClick: withLog("User clicked 'Next' button", () =>
              runWizardCleanup({ actions: [
                () => setStep(3),
                resetFilters,
                () => yellowGraphicsLayer?.graphics.removeAll(),
                () => yellowGeometriesGraphicsLayer?.graphics.removeAll(),
              ] })
            ),
          },
          {
            label: labels.filteren,
            onClick: withLog("User clicked 'Filter' button", () =>
              setOpenFilter(true)
            ),
          },
          {
            label: labels.opslaan,
            onClick: handleSaveClick,
          },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", () =>
              runWizardCleanup({ actions: [
                resetFeatures,
                handleCancel,
                resetFilters,
                clear,
              ] })
            ),
          },
        ]}
      />
      <WizardLoadingOverlay show={loading} />
    </>
  );
}
