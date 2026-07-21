import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";
import {
  createWizardFilterStepNext,
  createWizardSelectionGraphicsControls,
} from "../../../common/wizardFilterStepSelection";

function useFlightPlanStep2Actions(setOpenFilter: (value: boolean) => void) {
  const { resetFeatures } = useResetFeatures();
  const { withLog, labels } = useWizardButtons("Second step");
  const store = useFlightPlanState();
  const { mapView, yellowGraphicsLayer, yellowGeometriesGraphicsLayer, clearGraphics } =
    useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();
  const { selectionGraphics, clearSelectionGraphics } =
    createWizardSelectionGraphicsControls({
      mapView,
      selectedGraphics: store.selectedGraphics,
      setSelectedGraphics: store.setSelectedGraphics,
      hoveredGraphic: store.hoveredGraphic,
      setHoveredGraphic: store.setHoveredGraphic,
    });
  return {
    labels,
    withLog,
    setOpenFilter,
    handleNext: createWizardFilterStepNext({
      step: store.step,
      setStep: store.setStep,
      resetFilters,
      selectionGraphics,
      clearYellowLayers: () => {
        yellowGraphicsLayer?.graphics.removeAll();
        yellowGeometriesGraphicsLayer?.graphics.removeAll();
      },
    }),
    handleBack: () =>
      runWizardCleanup([
        () => store.setStep(2),
        resetFilters,
        () => store.setSelectedPoints([]),
        resetFeatures,
        clearGraphics,
        clearSelectionGraphics,
      ]),
    handleCancel: () =>
      runWizardCleanup([resetFeatures, store.clear, handleCancel, resetFilters]),
  };
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
      onPrevious={actions.handleBack}
      previousLogMessage="User clicked 'Back' button"
      onFilter={() => actions.setOpenFilter(true)}
      onNext={actions.handleNext}
      onCancel={actions.handleCancel}
    />
  );
}
