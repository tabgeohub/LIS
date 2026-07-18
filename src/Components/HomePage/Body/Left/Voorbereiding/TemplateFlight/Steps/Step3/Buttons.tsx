import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import { useCancelCreateFlightPlan } from "hooks/handleCancel/useCancelCreateFlightPlan";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import { clearMapSelectionGraphics } from "hooks/wizard/clearMapSelectionGraphics";
import { collectTemplateFlightPointIds } from "./buildTemplateFlightSubmitIds";

export default function Buttons({
  setOpenFilter,
  name,
}: {
  setOpenFilter: (value: boolean) => void;
  name: string;
}) {
  const { resetFilters } = usePointsFilterStore();
  const handleCancel = useCancelCreateFlightPlan();
  const { clearGraphics, mapView } = useMapViewState();
  const { resetFeatures } = useResetFeatures();
  const { create, loading } = useCreateData("/templateFlight");
  const { logStep, labels } = useWizardButtons("Third step");
  const { user } = useAuth();
  const {
    selectedPoints2,
    selectedPoints,
    setSelectedPoints2,
    setStep,
    clear,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
    selectedGeometries,
    selectedGeometries2,
    setSelectedGeometries2,
  } = useTemplateFlightState();
  const { dbGeometries } = useGeometriesStore();

  const clearSelectionGraphics = () =>
    clearMapSelectionGraphics({
      mapView,
      selectedGraphics,
      setSelectedGraphics,
      hoveredGraphic,
      setHoveredGraphic,
    });

  const handleSubmit = () => {
    const { uniquePointIds, uniqueSelectedGeometryIds } =
      collectTemplateFlightPointIds({
        selectedGeometries,
        selectedGeometries2,
        selectedPoints,
        selectedPoints2,
        dbGeometries,
      });

    logStep("User clicked 'Save' button to save flight template data", {
      name,
      points: uniquePointIds,
      geometries: uniqueSelectedGeometryIds,
    });

    create({
      data: { points: uniquePointIds, name, regio_id: user.role },
      onSuccess: () => {
        clear();
        clearGraphics();
      },
    });
  };

  const handlePrevious = () =>
    runWizardCleanup([
      () => setStep(2),
      resetFilters,
      () => setSelectedPoints2([]),
      () => setSelectedGeometries2([]),
      resetFeatures,
      clearGraphics,
      clearSelectionGraphics,
    ]);

  const handleCancelClick = () =>
    runWizardCleanup([
      resetFeatures,
      handleCancel,
      resetFilters,
      clear,
      clearGraphics,
      clearSelectionGraphics,
    ]);

  return (
    <>
      <WizardButtonBar
        className=""
        buttons={[
          { label: labels.vorige, onClick: handlePrevious },
          { label: labels.filteren, onClick: () => setOpenFilter(true) },
          { label: labels.opslaan, onClick: handleSubmit },
          { label: labels.annuleren, onClick: handleCancelClick },
        ]}
      />
      <WizardLoadingOverlay show={loading} />
    </>
  );
}
