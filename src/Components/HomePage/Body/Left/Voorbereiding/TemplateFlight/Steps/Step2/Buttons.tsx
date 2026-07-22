import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";
import { useFilterStepWizardSelection } from "../../../common/useFilterStepWizardSelection";
import {
  runTemplateFlightCancelCleanup,
  runTemplateFlightPreviousCleanup,
} from "../../helpers/templateFlightWizardCleanup";

function useTemplateFlightStep2Actions(setOpenFilter: (value: boolean) => void) {
  const store = useTemplateFlightState();
  const { mapView, yellowGraphicsLayer, clearGraphics } = useMapViewState();
  const resetFilters = usePointsFilterStore((s) => s.resetFilters);
  const handleCancel = useHandleCancel();
  const { resetFeatures } = useResetFeatures();
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
      clearYellowLayers: () => yellowGraphicsLayer?.graphics.removeAll(),
    });
  return {
    labels,
    withLog,
    setOpenFilter,
    handleNext,
    handlePrevious: () =>
      runTemplateFlightPreviousCleanup({
        previousStep: 1,
        setStep: store.setStep,
        resetFilters,
        clearSelectedPoints: () => store.setSelectedPoints([]),
        clearSelectedGeometries: () => store.setSelectedGeometries([]),
        resetFeatures,
        clearGraphics,
        clearSelectionGraphics,
      }),
    handleCancelClick: () =>
      runTemplateFlightCancelCleanup({
        resetFeatures,
        clear: store.clear,
        clearBeforeCancel: true,
        beforeCancel: () => store.setSelectedGeometries([]),
        handleCancel,
        resetFilters,
        clearGraphics,
        clearSelectionGraphics,
      }),
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
