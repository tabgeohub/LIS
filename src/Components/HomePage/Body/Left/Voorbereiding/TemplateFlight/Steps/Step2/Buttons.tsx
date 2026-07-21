import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";
import {
  createWizardFilterStepNext,
  createWizardSelectionGraphicsControls,
} from "../../../common/wizardFilterStepSelection";

function useTemplateFlightStep2Actions(setOpenFilter: (value: boolean) => void) {
  const store = useTemplateFlightState();
  const { mapView, yellowGraphicsLayer, clearGraphics } = useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();
  const { resetFeatures } = useResetFeatures();
  const { withLog, labels } = useWizardButtons("Second step");
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
      clearYellowLayers: () => yellowGraphicsLayer?.graphics.removeAll(),
    }),
    handlePrevious: () =>
      runWizardCleanup([
        () => store.setStep(1),
        resetFilters,
        () => store.setSelectedPoints([]),
        () => store.setSelectedGeometries([]),
        resetFeatures,
        clearGraphics,
        clearSelectionGraphics,
      ]),
    handleCancelClick: () =>
      runWizardCleanup([
        resetFeatures,
        store.clear,
        () => store.setSelectedGeometries([]),
        handleCancel,
        resetFilters,
        clearGraphics,
        clearSelectionGraphics,
      ]),
  };
}

export default function Buttons({
  setOpenFilter,
}: {
  setOpenFilter: (value: boolean) => void;
}) {
  const actions = useTemplateFlightStep2Actions(setOpenFilter);
  return (
    <FilterStepWizardButtons
      labels={actions.labels}
      withLog={actions.withLog}
      onPrevious={actions.handlePrevious}
      previousLogMessage="User clicked 'Previous' button"
      onFilter={() => actions.setOpenFilter(true)}
      onNext={actions.handleNext}
      onCancel={actions.handleCancelClick}
    />
  );
}
