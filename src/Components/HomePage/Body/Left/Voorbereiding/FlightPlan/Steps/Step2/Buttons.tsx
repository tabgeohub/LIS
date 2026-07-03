import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";

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

    selectedGraphics.forEach((g) => mapView?.graphics.remove(g));
    setSelectedGraphics([]);

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }

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
    <WizardButtonBar
      buttons={[
        { label: labels.vorige, onClick: withLog("User clicked 'Back' button", handleBack) },
        {
          label: labels.filteren,
          onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
        },
        { label: labels.volgende, onClick: withLog("User clicked 'Next' button", handleNext) },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () =>
            runWizardCleanup([resetFeatures, clear, handleCancel, resetFilters])
          ),
        },
      ]}
    />
  );
}
