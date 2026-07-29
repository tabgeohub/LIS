import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { usePointsFilterStore } from "Components/HomePage/hooks/filters/usePointsFilterStore";
import { useCreateData } from "utils/useCreateData";
import { useCancelCreateFlightPlan } from "Components/HomePage/hooks/handleCancel/useCancelCreateFlightPlan";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useAuth } from "hooks/zustand/ui/useAuth";
import { useResetFeatures } from "Components/HomePage/hooks/features/useResetFeatures";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import {
  createTemplateFlightClearSelectionGraphics,
  runTemplateFlightCancelCleanup,
  runTemplateFlightPreviousCleanup,
} from "../../helpers/templateFlightWizardCleanup";
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
  const store = useTemplateFlightState();
  const {
    selectedPoints2,
    selectedPoints,
    setSelectedPoints2,
    setStep,
    clear,
    selectedGeometries,
    selectedGeometries2,
    setSelectedGeometries2,
  } = store;
  const { dbGeometries } = useGeometriesStore();

  const clearSelectionGraphics = createTemplateFlightClearSelectionGraphics({
    mapView,
    selectedGraphics: store.selectedGraphics,
    setSelectedGraphics: store.setSelectedGraphics,
    hoveredGraphic: store.hoveredGraphic,
    setHoveredGraphic: store.setHoveredGraphic,
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
    runTemplateFlightPreviousCleanup({
      previousStep: 2,
      setStep,
      resetFilters,
      clearSelectedPoints: () => setSelectedPoints2([]),
      clearSelectedGeometries: () => setSelectedGeometries2([]),
      resetFeatures,
      clearGraphics,
      clearSelectionGraphics,
    });

  const handleCancelClick = () =>
    runTemplateFlightCancelCleanup({
      resetFeatures,
      clear,
      handleCancel,
      resetFilters,
      clearGraphics,
      clearSelectionGraphics,
    });

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
