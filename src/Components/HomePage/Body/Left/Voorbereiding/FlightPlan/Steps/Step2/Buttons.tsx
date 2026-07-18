import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import { clearMapSelectionGraphics } from "hooks/wizard/clearMapSelectionGraphics";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";

export default function Buttons({
  setOpenFilter,
}: {
  setOpenFilter: (value: boolean) => void;
}) {
  const { resetFeatures } = useResetFeatures();
  const { withLog, labels } = useWizardButtons("Second step");
  const {
    step,
    setStep,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
    setSelectedPoints,
    clear,
  } = useFlightPlanState();

  const { mapView, yellowGraphicsLayer, yellowGeometriesGraphicsLayer, clearGraphics } =
    useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();

  const handleNext = () => {
    setStep(step + 1);
    resetFilters();
    clearMapSelectionGraphics({
      mapView,
      selectedGraphics,
      setSelectedGraphics,
      hoveredGraphic,
      setHoveredGraphic,
    });
    yellowGraphicsLayer?.graphics.removeAll();
    yellowGeometriesGraphicsLayer?.graphics.removeAll();
  };

  const handleBack = () =>
    runWizardCleanup([
      () => setStep(2),
      resetFilters,
      () => setSelectedPoints([]),
      resetFeatures,
      clearGraphics,
    ]);

  return (
    <FilterStepWizardButtons
      labels={labels}
      withLog={withLog}
      onPrevious={handleBack}
      previousLogMessage="User clicked 'Back' button"
      onFilter={() => setOpenFilter(true)}
      onNext={handleNext}
      onCancel={() =>
        runWizardCleanup([resetFeatures, clear, handleCancel, resetFilters])
      }
    />
  );
}
