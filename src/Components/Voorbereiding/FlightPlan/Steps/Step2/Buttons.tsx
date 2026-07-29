import { usePointsFilterStore } from "Components/HomePage/hooks/filters/usePointsFilterStore";
import { useFlightPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useFlightPlanState";
import { useMapViewState } from "hooks/zustand/ui";
import { useHandleCancel } from "Components/HomePage/hooks/handleCancel/useHandleCancel";
import { useResetFeatures } from "Components/HomePage/hooks/features/useResetFeatures";
import { runWizardCleanup } from "Components/HomePage/hooks/wizard/useWizardCleanup";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";
import { useWizardFilterStep2Buttons } from "../../../common/useWizardFilterStep2Buttons";

function useFlightPlanStep2Actions(setOpenFilter: (value: boolean) => void) {
  const { resetFeatures } = useResetFeatures();
  const store = useFlightPlanState();
  const { mapView, yellowGraphicsLayer, yellowGeometriesGraphicsLayer, clearGraphics } =
    useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();

  return useWizardFilterStep2Buttons({
    setOpenFilter,
    store,
    mapView,
    resetFilters,
    clearYellowLayers: () => {
      yellowGraphicsLayer?.graphics.removeAll();
      yellowGeometriesGraphicsLayer?.graphics.removeAll();
    },
    buildPrevious: (clearSelectionGraphics) => () =>
      runWizardCleanup({ actions: [
        () => store.setStep(2),
        resetFilters,
        () => store.setSelectedPoints([]),
        resetFeatures,
        clearGraphics,
        clearSelectionGraphics,
      ] }),
    buildCancel: () => () =>
      runWizardCleanup({ actions: [resetFeatures, store.clear, handleCancel, resetFilters] }),
  });
}

export default function Buttons({
  setOpenFilter,
}: {
  setOpenFilter: (value: boolean) => void;
}) {
  const actions = useFlightPlanStep2Actions(setOpenFilter);
  return (
    <FilterStepWizardButtons
      labels={actions.labels}
      withLog={actions.withLog}
      onPrevious={actions.handlePrevious}
      previousLogMessage="User clicked 'Back' button"
      onFilter={() => actions.setOpenFilter(true)}
      onNext={actions.handleNext}
      onCancel={actions.handleCancel}
    />
  );
}
