import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";

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

  const removeGraphics = () => {
    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
    resetFilters();
    removeGraphics();
    yellowGraphicsLayer?.graphics.removeAll();
  };

  const handlePrevious = () =>
    runWizardCleanup([
      () => setStep(1),
      resetFilters,
      () => setSelectedPoints([]),
      () => setSelectedGeometries([]),
      resetFeatures,
      clearGraphics,
      removeGraphics,
    ]);

  const handleCancelClick = () =>
    runWizardCleanup([
      resetFeatures,
      clear,
      () => setSelectedGeometries([]),
      handleCancel,
      resetFilters,
      clearGraphics,
      removeGraphics,
    ]);

  return (
    <WizardButtonBar
      buttons={[
        {
          label: labels.vorige,
          onClick: withLog("User clicked 'Previous' button", handlePrevious),
        },
        {
          label: labels.filteren,
          onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
        },
        { label: labels.volgende, onClick: withLog("User clicked 'Next' button", handleNext) },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", handleCancelClick),
        },
      ]}
    />
  );
}
