import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { FilterStepWizardButtons } from "../../../common/FilterStepWizardButtons";
import { useWizardFilterStep2Buttons } from "../../../common/useWizardFilterStep2Buttons";
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

  return useWizardFilterStep2Buttons({
    setOpenFilter,
    store,
    mapView,
    resetFilters,
    clearYellowLayers: () => yellowGraphicsLayer?.graphics.removeAll(),
    buildPrevious: (clearSelectionGraphics) => () =>
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
    buildCancel: (clearSelectionGraphics) => () =>
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
  });
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
      onCancel={actions.handleCancel}
    />
  );
}
