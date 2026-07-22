import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";
import { useFilterStepWizardSelection } from "../../../common/useFilterStepWizardSelection";

function useFlightPlanStep2Actions(setOpenFilter: (value: boolean) => void) {
  const { resetFeatures } = useResetFeatures();
  const store = useFlightPlanState();
  const { mapView, yellowGraphicsLayer, yellowGeometriesGraphicsLayer, clearGraphics } =
    useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();
  const { labels, withLog, clearSelectionGraphics, handleNext } =
    useFilterStepWizardSelection({
      selection: {
        mapView,
        selectedGraphics: store.selectedGraphics,
        setSelectedGraphics: store.setSelectedGraphics,
        hoveredGraphic: store.hoveredGraphic,
        setHoveredGraphic: store.setHoveredGraphic,
      },
      step: store.step,
      setStep: store.setStep,
      resetFilters,
      clearYellowLayers: () => {
        yellowGraphicsLayer?.graphics.removeAll();
        yellowGeometriesGraphicsLayer?.graphics.removeAll();
      },
    });
  return {
    labels,
    withLog,
    setOpenFilter,
    handleNext,
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
