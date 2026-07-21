import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import { clearMapSelectionGraphics } from "hooks/wizard/clearMapSelectionGraphics";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";
import { createFilterStepAdvanceHandler } from "../../../common/createFilterStepAdvanceHandler";

export default function Buttons({
  setOpenFilter,
}: {
  setOpenFilter: (value: boolean) => void;
}) {
  const {
    step,
    setStep,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
    clear,
    setSelectedPoints,
    setSelectedGeometries,
  } = useTemplateFlightState();

  const { mapView, yellowGraphicsLayer, clearGraphics } = useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();
  const { resetFeatures } = useResetFeatures();
  const { withLog, labels } = useWizardButtons("Second step");

  const selectionGraphics = {
    mapView,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
  };
  const clearSelectionGraphics = () =>
    clearMapSelectionGraphics(selectionGraphics);

  const handleNext = createFilterStepAdvanceHandler({
    step,
    setStep,
    resetFilters,
    selectionGraphics,
    afterAdvance: () => {
      yellowGraphicsLayer?.graphics.removeAll();
    },
  });

  const handlePrevious = () =>
    runWizardCleanup([
      () => setStep(1),
      resetFilters,
      () => setSelectedPoints([]),
      () => setSelectedGeometries([]),
      resetFeatures,
      clearGraphics,
      clearSelectionGraphics,
    ]);

  const handleCancelClick = () =>
    runWizardCleanup([
      resetFeatures,
      clear,
      () => setSelectedGeometries([]),
      handleCancel,
      resetFilters,
      clearGraphics,
      clearSelectionGraphics,
    ]);

  return (
    <FilterStepWizardButtons
      labels={labels}
      withLog={withLog}
      onPrevious={handlePrevious}
      previousLogMessage="User clicked 'Previous' button"
      onFilter={() => setOpenFilter(true)}
      onNext={handleNext}
      onCancel={handleCancelClick}
    />
  );
}
